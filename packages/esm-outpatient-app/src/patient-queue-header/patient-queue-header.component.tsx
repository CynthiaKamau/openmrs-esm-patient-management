import React from 'react';
import { useTranslation } from 'react-i18next';
import { Calendar, Location } from '@carbon/react/icons';
import { Dropdown } from '@carbon/react';
import { ExtensionSlot, formatDate, useSession } from '@openmrs/esm-framework';
import PatientQueueIllustration from './patient-queue-illustration.component';
import styles from './patient-queue-header.scss';
import { useQueueLocations } from '../patient-search/hooks/useQueueLocations';
import {
  updateSelectedQueueLocationUuid,
  updateSelectedQueueLocationName,
  updateSelectedServiceName,
  useSelectedQueueLocationName,
  useSelectedQueueLocationUuid,
} from '../helpers/helpers';

const PatientQueueHeader: React.FC<{ title: string }> = ({ title }) => {
  const { t } = useTranslation();
  const userSession = useSession();
  const userLocation = userSession?.sessionLocation?.display;
  const { queueLocations } = useQueueLocations();
  const currentQueueLocationName = useSelectedQueueLocationName();

  const handleQueueLocationChange = ({ selectedItem }) => {
    updateSelectedQueueLocationUuid(selectedItem.id);
    updateSelectedQueueLocationName(selectedItem.name);
    updateSelectedServiceName('All');
  };

  return (
    <>
      <ExtensionSlot extensionSlotName="breadcrumbs-slot" />
      <div className={styles.header}>
        <div className={styles['left-justified-items']}>
          <PatientQueueIllustration />
          <div className={styles['page-labels']}>
            <p>{t('serviceQueue', 'Service queue')}</p>
            <p className={styles['page-name']}>{title}</p>
          </div>
        </div>
        <div className={styles['right-justified-items']}>
          <div className={styles['date-and-location']}>
            <Location size={16} />
            <span className={styles.value}>{userLocation}</span>
            <span className={styles.middot}>&middot;</span>
            <Calendar size={16} />
            <span className={styles.value}>{formatDate(new Date(), { mode: 'standard' })}</span>
          </div>
          <div className={styles.dropdown}>
            <label className={styles.view}>{t('view', 'View')}:</label>
            <Dropdown
              id="typeOfCare"
              label={currentQueueLocationName}
              items={[{ display: `${t('all', 'All')}` }, ...queueLocations]}
              itemToString={(item) => (item ? item.name : '')}
              type="inline"
              onChange={handleQueueLocationChange}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default PatientQueueHeader;
