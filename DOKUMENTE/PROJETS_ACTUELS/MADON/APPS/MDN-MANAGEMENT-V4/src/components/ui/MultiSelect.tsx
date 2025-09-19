import React, { useState } from 'react';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from './Command';
import { Popover, PopoverContent, PopoverTrigger } from './Popover';
import { Button } from './Button';
import { Badge } from './Badge';
import { X } from 'lucide-react';

interface Option {
  value: string;
  label: string;
}

interface MultiSelectProps {
  options: Option[];
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  creatable?: boolean;
}

export const MultiSelect: React.FC<MultiSelectProps> = ({
  options,
  value,
  onChange,
  placeholder = 'Sélectionner...',
  creatable = false
}) => {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const selectedOptions = options.filter(option => value.includes(option.value));
  const unselectedOptions = options.filter(option => !value.includes(option.value));

  const handleSelect = (optionValue: string) => {
    if (value.includes(optionValue)) {
      onChange(value.filter(v => v !== optionValue));
    } else {
      onChange([...value, optionValue]);
    }
  };

  const handleCreate = () => {
    if (inputValue.trim() && creatable) {
      const newOption = {
        value: inputValue.toLowerCase(),
        label: inputValue
      };
      onChange([...value, newOption.value]);
      setInputValue('');
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          <div className="flex flex-wrap gap-1">
            {selectedOptions.length > 0 ? (
              selectedOptions.map(option => (
                <Badge
                  key={option.value}
                  variant="secondary"
                  className="mr-1"
                >
                  {option.label}
                  <button
                    className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleSelect(option.value);
                      }
                    }}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleSelect(option.value);
                    }}
                  >
                    <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                  </button>
                </Badge>
              ))
            ) : (
              <span className="text-muted-foreground">{placeholder}</span>
            )}
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput
            placeholder="Rechercher..."
            value={inputValue}
            onValueChange={setInputValue}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && creatable) {
                handleCreate();
              }
            }}
          />
          <CommandEmpty>
            {creatable && inputValue.trim() ? (
              <button
                className="w-full text-left px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground"
                onClick={handleCreate}
              >
                Créer "{inputValue}"
              </button>
            ) : (
              'Aucun résultat trouvé.'
            )}
          </CommandEmpty>
          <CommandGroup>
            {unselectedOptions.map(option => (
              <CommandItem
                key={option.value}
                onSelect={() => handleSelect(option.value)}
              >
                {option.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}; 