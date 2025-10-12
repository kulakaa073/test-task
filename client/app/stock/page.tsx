'use client';

import { useState } from 'react';
import { Spinner, Card, CardBody } from '@heroui/react';
import StocksFilters from '@/components/StocksFilters/StocksFilters';
import StocksTable from '@/components/StocksTable/StocksTable';
import StocksErrorCard from '@/components/StockErrorCard/StockErrorCard';
import StocksResultsInfo from '@/components/StocksResultsIfo/StocksResultsInfo';

interface Stock {
  symbol: string;
  name: string;
  marketCap: number;
  price: number;
  changes: number;
  changePerMonth: number;
}

interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export default function StocksPage() {
  const [symbol, setSymbol] = useState('');
  const [country, setCountry] = useState('');
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const handleSearch = async (page: number = 1) => {
    if (!symbol && !country) {
      setError('Please provide either a symbol or country');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (symbol) params.append('symbol', symbol);
      if (country) params.append('country', country);
      params.append('page', page.toString());
      params.append('limit', '20');

      const response = await fetch(`/stocks?${params.toString()}`);

      if (!response.ok) {
        throw new Error('Failed to fetch stocks data');
      }

      const data = await response.json();
      setStocks(data.data || []);
      setPagination(data.pagination);
      setCurrentPage(page);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setStocks([]);
      setPagination(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (newSymbol: string, newCountry: string) => {
    setSymbol(newSymbol);
    setCountry(newCountry);
    setCurrentPage(1);
    handleSearch(1);
  };

  const handlePageChange = (page: number) => {
    handleSearch(page);
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold">Stock Search</h1>

      <StocksFilters onSubmit={handleSubmit} loading={loading} />

      {error && <StocksErrorCard error={error} />}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Spinner label="Loading stocks..." />
        </div>
      ) : stocks.length > 0 ? (
        <>
          <StocksTable
            stocks={stocks}
            pagination={pagination}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
          {pagination && (
            <StocksResultsInfo
              page={pagination.page}
              limit={pagination.limit}
              total={pagination.total}
            />
          )}
        </>
      ) : (
        <Card>
          <CardBody className="text-center p-8">
            <p className="text-gray-500">
              Enter search criteria and click Search to find stocks
            </p>
          </CardBody>
        </Card>
      )}
    </div>
  );
}
