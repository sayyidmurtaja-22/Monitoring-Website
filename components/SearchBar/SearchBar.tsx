import { useRouter, useSearchParams,usePathname } from 'next/navigation';
import  { useTransition } from 'react'

const SearchBar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [pending, stratTransition] =useTransition();

  const handleSearch = (term:string) => {
    const formattedTerm = term.toLocaleLowerCase().replace(/\s+/g, '');

    const params = new URLSearchParams(searchParams.toString());
    if(formattedTerm && formattedTerm !== "semua"){
      params.set('q',formattedTerm)
    }else{
      params.delete('q');
    }
    stratTransition(() => {
      router.replace(`${pathname}?${params.toString()}`);
    });
  }
  return (
    <div className='mb-6'>

      <input type='text'placeholder="Ketik ,'line chart','Bar chart', atau 'semua'..."
      className='w-full p-2 border border-gray-50 rounded-md' defaultValue={searchParams.get('q')?.toString() || ''}
      onChange={(e) => {
        handleSearch(e.target.value);
      }}/>
        {pending && <span className='text-sm'>Memuat...</span>}
      
    </div>
  )
}

export default SearchBar
