import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Overlay from '../overlay.component';
import BasicSearch from './basic-search.component';
import AdvancedSearch from './advanced-search.component';
import PatientScheduledVisits from './patient-scheduled-visits.component';
import SearchResults from './search-results.component';
import { SearchTypes, SearchResultTypes } from '../types';

interface PatientSearchProps {
  closePanel: () => void;
}

const PatientSearch: React.FC<PatientSearchProps> = ({ closePanel }) => {
  const { t } = useTranslation();
  const [searchType, setSearchType] = useState<SearchTypes>(SearchTypes.BASIC);
  const [searchResultType, setSearchResultType] = useState<SearchResultTypes>(SearchResultTypes.SEARCH_RESULTS);

  const toggleSearchType = (searchType: SearchTypes) => {
    setSearchType(searchType);
  };

  const toggleSearchResultType = (searchResultType: SearchResultTypes) => {
    setSearchResultType(searchResultType);
  };

  return (
    <>
      <Overlay header={t('addPatientToList', 'Add patient to list')} closePanel={closePanel}>
        <div className="omrs-main-content">
          {searchType === SearchTypes.BASIC ? (
            <BasicSearch toggleSearchType={toggleSearchType} toggleSearchResultType={toggleSearchResultType} />
          ) : searchType === SearchTypes.ADVANCED ? (
            <AdvancedSearch toggleSearchType={toggleSearchType} />
          ) : null}

          {searchResultType === SearchResultTypes.SEARCH_RESULTS ? (
            <SearchResults patients={[]} toggleSearchResultType={toggleSearchResultType} />
          ) : searchResultType === SearchResultTypes.SCHEDULED_VISITS ? (
            <PatientScheduledVisits toggleSearchResultType={toggleSearchResultType} />
          ) : null}
        </div>
      </Overlay>
    </>
  );
};

export default PatientSearch;
