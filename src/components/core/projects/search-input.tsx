'use client';

import { Search } from 'lucide-react';

import { Input } from '@/components/ui/input';

interface SearchInputProps {
  value: string;
  name: string;
  onValueChange?: (value: string) => void;
}

export function SearchInput({ value, name, onValueChange }: SearchInputProps) {
  return (
    <div className='relative'>
      <Search className='absolute top-2.5 left-2 h-4 w-4 text-neutral-600 dark:text-neutral-400' />
      <Input
        name={name}
        value={value}
        onChange={e => onValueChange?.(e.target.value)}
        placeholder='Search repositories...'
        className='h-9 w-full border-neutral-200 bg-transparent pl-8 text-base text-neutral-900 placeholder:text-neutral-600 md:text-sm dark:border-neutral-800 dark:text-neutral-100 dark:placeholder:text-neutral-400'
      />
    </div>
  );
}
