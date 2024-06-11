import React, { useState, useEffect } from 'react';
import IResponseCoworking from '@/utils/types/coworkingsResponse';
import getCountriesfilter from '@/utils/gets/countriesFilter';
import GetCoworkingsFilter from '@/utils/gets/getCoworkingsFilter';
import getoptions from '@/utils/gets/getoptionsFilter';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

const useCoworkings = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const [totalCoworkings, setTotalCoworkings] = useState(0);
  const [coworkings, setCoworkings] = useState<IResponseCoworking[]>([]);
  const [countries, setCountries] = useState<any[]>([]);
  const [states, setStates] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);
  const [filter, setFilter] = useState({
    country: '',
    state: '',
    city: '',
    page: 1,
    limit: 3,
  });
  useEffect(() => {
    const getCountries = async () => {
      const countries = await getCountriesfilter();
      const currentcoworkings = await GetCoworkingsFilter({ filter });
      setCoworkings(currentcoworkings.coworking);
      setTotalCoworkings(currentcoworkings.total);
      setCountries(countries);
    };
    getCountries();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updatedFilter = () => {
    const currentPage = Number(searchParams.get('page')) || 1;
    setFilter({ ...filter, page: currentPage });
  };

  useEffect(() => {
    updatedFilter();
  }, [searchParams]);

  useEffect(() => {
    const getOptions = async () => {
      const options = await getoptions({ filter });
      if (filter.city) {
        const currentcoworkings = await GetCoworkingsFilter({ filter });
        setCoworkings(currentcoworkings.coworking);
        setTotalCoworkings(currentcoworkings.total);
      } else if (filter.state) {
        setCities(options);
        const currentcoworkings = await GetCoworkingsFilter({ filter });
        setCoworkings(currentcoworkings.coworking);
        setTotalCoworkings(currentcoworkings.total);
      } else if (filter.country) {
        setStates(options);
        const currentcoworkings = await GetCoworkingsFilter({ filter });
        setCoworkings(currentcoworkings.coworking);
        setTotalCoworkings(currentcoworkings.total);
      } else if (filter.page) {
        const currentcoworkings = await GetCoworkingsFilter({ filter });
        setCoworkings(currentcoworkings.coworking);
        setTotalCoworkings(currentcoworkings.total);
      }
    };
    getOptions();
  }, [filter]);

  const handleChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams);

    if (params.get('state') === '') params.delete('state');
    if (params.get('city') === '') params.delete('city');
    const { name, value } = event.target;
    const newfilter = { country: '', state: '', city: '', page: 1, limit: 3 };
    if (name === 'country') {
      newfilter.country = value;
      newfilter.state = '';
      newfilter.city = '';
      params.set('country', event.target.value);
      params.delete('state');
      params.delete('city');
      setCities([]);
      setStates([]);
    }
    if (name === 'state') {
      newfilter.country = filter.country;
      newfilter.state = value;
      newfilter.city = '';
      params.set('state', event.target.value);
      params.delete('city');

      setCities([]);
    }
    if (name === 'city') {
      newfilter.country = filter.country;
      newfilter.state = filter.state;
      newfilter.city = value;
      params.set('city', event.target.value);
    }
    if (params.get('country') === '') params.delete('country');
    if (params.get('state') === '') params.delete('state');
    if (params.get('city') === '') params.delete('city');

    setFilter(newfilter);
    replace(`${pathname}?${params.toString()}`);
  };

  return {
    coworkings,
    countries,
    states,
    cities,
    handleChange,
    totalCoworkings,
    filter,
  };
};
export default useCoworkings;
