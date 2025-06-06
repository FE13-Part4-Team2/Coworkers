'use client';
import { useState, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import InputBase from '@/components/common/Input/InputBase';
import IconRenderer from '@/components/common/Icons/IconRenderer';
import debounce from 'lodash.debounce';

interface SearchInputProps {
  onSearch: (query: string) => void;
}

export default function SearchInput({ onSearch }: SearchInputProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('keyword') || '';
  const [query, setQuery] = useState<string>(initialQuery);

  const debouncedSearch = useMemo(
    () =>
      debounce((value: string) => {
        onSearch(value.trim());
        const newParams = new URLSearchParams(searchParams.toString());
        if (value) {
          newParams.set('keyword', value);
          newParams.set('page', '1');
        } else {
          newParams.delete('keyword');
        }
        router.push(`/boards?${newParams.toString()}`);
      }, 300),
    [onSearch, router, searchParams]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    debouncedSearch(value);
  };

  return (
    <div className="laptop:mb-10 tablet:mb-8 relative mb-6">
      <InputBase
        containerClassName="w-full tablet:h-[56px] h-[48px] bg-slate-800 gap-3"
        placeholder="검색어를 입력해 주세요"
        leftIcon={<IconRenderer name="SearchIcon" />}
        value={query}
        onChange={handleInputChange}
      />
    </div>
  );
}
