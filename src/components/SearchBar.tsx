import React, { useState } from 'react';
import { LuSearch } from 'react-icons/lu';

interface SearchBarProps {
    onSearch: (id: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearch = () => {
        onSearch(searchTerm);
    };

    return (
        <div className="flex items-center rounded-lg drop-shadow-[0px_0px_8px_rgba(0,0,0,0.15)] bg-white/70 backdrop-blur-sm px-1 cursor-default right-4 top-4 fixed w-52 md:w-96 h-10 md:h-12">
            <div className="absolute md:block hidden">
                <LuSearch
                    className=" ml-2"
                    size={'1.5em'}
                    style={{ opacity: 0.8 }}
                />
            </div>

            <input
                className="h-8 md:h-10 pl-1 md:pl-10 w-full bg-transparent placeholder:text-zinc-600 placeholder:text-xs md:placeholder:text-base"
                placeholder="Search by Chain Name or Chain Id"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        handleSearch();
                    }
                }}
            />
            <button
                onClick={handleSearch}
                className="text-white absolute right-1 bg-black/50 flex items-center rounded px-2 py-1 md:top-2 md:right-2 top-12"
            >
                <div className=" block md:hidden">
                    <LuSearch
                        className=" mr-2"
                        size={'1em'}
                        style={{ opacity: 0.8 }}
                    />
                </div>
                Search
            </button>
        </div>
    );
};

export default SearchBar;
