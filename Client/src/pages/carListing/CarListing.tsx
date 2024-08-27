import Container from '../../compoments/container/Container';
import { cars } from '../../utils/data';
import PrimaryCarCard from '../../compoments/cards/PrimaryCarCard';
import { TCar, TParam } from '../../types';

import SecondaryCarCard from '../../compoments/cards/SecondaryCarCard';
import PaginationPrimary from '../../compoments/pagination/PaginationPrimary';
import FilterBox, { TViewType } from './sections/FilterBox';
import { useEffect, useState } from 'react';
import { useGetCarsQuery } from '../../redux/features/Car/Car.api';
import { useLocation } from 'react-router-dom';

const CarListing = () => {
  const [viewType, setViewType] = useState<TViewType>('grid');
  const location = useLocation()

  
  const searchParams = new URLSearchParams(location.search)
  const params:TParam[] = []
  
  const keys = ['searchTerm','brand','type','minPrice','maxPrice','location']
 
  keys.forEach(key=>{
    const value = searchParams.get(key)
   if(value){
    params.push({name:key,value})
   }
   
  })

  const { data, refetch,isLoading: carsLoading } = useGetCarsQuery(params);
  const cars = data?.data;

  useEffect(()=>{
     refetch()
     window.scrollTo(0, 0);
  },[location.search])


  const handelSetViewType = (type: TViewType) => {
    setViewType(type);
  };
 
  
  return (
    <div className="bg-gray-primary dark:bg-dark-light-primary min-h-[90vh] py-5 relative overflow-hidden">
      <Container>
        {/* Search box */}
        <FilterBox handelSetViewType={handelSetViewType} />
        {cars?.length ? (
          <div
            className={`grid gap-5 ${viewType === 'grid' ? ' grid-cols-1 md:grid-cols-3 lg:grid-cols-4 ' : ' grid-cols-1 md:grid-cols-2'}`}
          >
            {cars?.map((car, index) => {
              if (viewType === 'grid') {
                return <PrimaryCarCard car={car as TCar} key={index} />;
              } else {
                return <SecondaryCarCard car={car as TCar} key={index} />;
              }
            })}
          </div>
        ) : (
          <div className="mt-10 flex items-center justify-center">
            <h1 className="mt-32 text-3xl md:text-4xl text-slate-100">No Results Found</h1>
          </div>
        )}
        {cars?.length && (
          <div className="mt-20 flex justify-center">
            <PaginationPrimary page={5} />
          </div>
        )}
      </Container>
    </div>
  );
};

export default CarListing;
