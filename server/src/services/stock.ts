// stock.ts (service)
import { getEnvVar } from '../utils/getEnvVar.ts';

const BASE_URL = 'https://finnhub.io/api/v1';

interface Stock {
  symbol: string;
  name: string;
  marketCap: number;
  price: number;
  changes: number;
  changePerMonth: number;
}

interface PaginatedResponse {
  results: Stock[];
  total: number;
}

// Add delay to avoid rate limiting
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const getStocks = async ({
  symbol,
  country,
  limit,
  offset,
}: {
  symbol?: string | undefined;
  country?: string | undefined;
  limit: number;
  offset: number;
}): Promise<PaginatedResponse> => {
  const FINNHUB_API_KEY = getEnvVar('FINNHUB_API_KEY');

  if (!FINNHUB_API_KEY) {
    throw { statusCode: 500, message: 'API key not configured' };
  }

  try {
    let searchResults: Array<{ symbol: string; description?: string }> = [];

    if (symbol) {
      const searchUrl = `${BASE_URL}/search?q=${encodeURIComponent(symbol)}&token=${FINNHUB_API_KEY}`;

      const result = await fetch(searchUrl);

      if (!result.ok) {
        throw new Error(`Search API error: ${result.status}`);
      }

      const data = await result.json();
      searchResults = Array.isArray(data.result) ? data.result : [];
    }

    if (country && !symbol) {
      // When only country is provided
      const symbolUrl = `${BASE_URL}/stock/symbol?exchange=${encodeURIComponent(country)}&token=${FINNHUB_API_KEY}`;

      const result = await fetch(symbolUrl);

      if (!result.ok) {
        throw new Error(`Symbol API error: ${result.status}`);
      }

      const data = await result.json();
      searchResults = Array.isArray(data) ? data : [];
    } else if (country && symbol) {
      // When both are provided, search by symbol and filter by country in results
      const searchUrl = `${BASE_URL}/search?q=${encodeURIComponent(symbol)}&token=${FINNHUB_API_KEY}`;

      const result = await fetch(searchUrl);

      if (!result.ok) {
        throw new Error(`Search API error: ${result.status}`);
      }

      const data = await result.json();
      const allResults = Array.isArray(data.result) ? data.result : [];

      // Filter by country/exchange
      searchResults = allResults.filter(
        (r: any) =>
          r.exchange &&
          r.exchange.toUpperCase().includes(country.toUpperCase()),
      );
    }

    if (searchResults.length === 0) {
      return { results: [], total: 0 };
    }

    // Extract symbols for detailed data fetching
    const symbols = searchResults
      .map((r: any) => r.symbol || r)
      .filter((s: string) => s && typeof s === 'string');

    const totalResults = symbols.length;
    const paginatedSymbols = symbols.slice(offset, offset + limit);

    // Fetch detailed data for each symbol in parallel with rate limiting
    const stocksData = await Promise.all(
      paginatedSymbols.map(async (sym: string, index: number) => {
        try {
          // Add delay between requests to avoid rate limiting
          await delay(index * 100);

          // Fetch quote data first (price, changes)
          const quoteUrl = `${BASE_URL}/quote?symbol=${encodeURIComponent(sym)}&token=${FINNHUB_API_KEY}`;
          const quoteRes = await fetch(quoteUrl);

          if (!quoteRes.ok) {
            console.warn(`Quote fetch failed for ${sym}: ${quoteRes.status}`);
            return {
              symbol: sym,
              name: sym,
              marketCap: 0,
              price: 0,
              changes: 0,
              changePerMonth: 0,
            } as Stock;
          }

          const quote = await quoteRes.json();

          // Add delay between requests
          await delay(100);

          // Fetch company profile
          const profileUrl = `${BASE_URL}/stock/profile2?symbol=${encodeURIComponent(sym)}&token=${FINNHUB_API_KEY}`;
          const profileRes = await fetch(profileUrl);

          let profile = { name: sym, marketCapitalization: 0 };
          if (profileRes.ok) {
            const profileData = await profileRes.json();
            profile = profileData;
          } else {
            console.warn(
              `Profile fetch failed for ${sym}: ${profileRes.status}`,
            );
          }

          return {
            symbol: sym,
            name: profile.name || sym,
            marketCap: profile.marketCapitalization
              ? profile.marketCapitalization * 1e6
              : 0,
            price: quote.c || 0,
            changes: quote.dp || 0,
            changePerMonth: ((quote.dp || 0) / 21) * 30, // Approximate monthly change based on daily change
          } as Stock;
        } catch (err) {
          console.error(`Error fetching data for ${sym}:`, err);
          return {
            symbol: sym,
            name: sym,
            marketCap: 0,
            price: 0,
            changes: 0,
          } as Stock;
        }
      }),
    );

    return {
      results: stocksData.filter((s) => s.price !== 0 || s.name !== s.symbol),
      total: totalResults,
    };
  } catch (err) {
    console.error('Stock fetch error:', err);
    throw { statusCode: 500, message: 'Failed to fetch data' };
  }
};
