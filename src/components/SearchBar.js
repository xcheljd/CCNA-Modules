import React from 'react';
import { Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

function SearchBar({
  searchQuery,
  onSearchChange,
  filterStatus,
  onFilterChange,
  filterConfidence,
  onConfidenceFilterChange,
}) {
  return (
    <div className="flex flex-col items-stretch gap-4 mb-6 md:flex-row md:flex-wrap md:items-center">
      <div className="relative flex-1 min-w-[250px] max-w-none md:max-w-[500px]">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
        <Input
          type="search"
          placeholder="Search modules, videos..."
          value={searchQuery}
          onChange={e => onSearchChange(e.target.value)}
          className={cn(
            'pl-10 pr-9',
            '[&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-decoration]:appearance-none'
          )}
        />
        {searchQuery && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 -translate-y-1/2"
            onClick={() => onSearchChange('')}
            aria-label="Clear search"
          >
            <X />
          </Button>
        )}
      </div>

      <div className="flex items-center gap-3 max-md:justify-between">
        <label
          htmlFor="status-filter"
          className="text-sm font-medium text-muted-foreground whitespace-nowrap"
        >
          Status:
        </label>
        <Select value={filterStatus} onValueChange={onFilterChange}>
          <SelectTrigger id="status-filter" className="w-48">
            <SelectValue placeholder="All Modules" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="all">All Modules</SelectItem>
              <SelectItem value="not-started">Not Started</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-3 max-md:justify-between">
        <label
          htmlFor="confidence-filter"
          className="text-sm font-medium text-muted-foreground whitespace-nowrap"
        >
          Confidence:
        </label>
        <Select value={filterConfidence} onValueChange={onConfidenceFilterChange}>
          <SelectTrigger id="confidence-filter" className="w-48">
            <SelectValue placeholder="All Levels" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="all">All Levels</SelectItem>
              <SelectItem value="not-rated">Not Rated</SelectItem>
              <SelectItem value="needs-review">Needs Review (1-2)</SelectItem>
              <SelectItem value="okay">Okay (3)</SelectItem>
              <SelectItem value="confident">Confident (4-5)</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

export default SearchBar;
