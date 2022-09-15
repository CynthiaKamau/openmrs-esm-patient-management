import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Column, Form, Layer, Stack, TextInput, Select, SelectItem, TextArea, ButtonSet, Button } from '@carbon/react';
import { showNotification, showToast, useLayoutType, useLocations } from '@openmrs/esm-framework';
import styles from './queue-service.scss';
import { saveQueue, useServiceConcepts } from './queue-service.resource';
import { SearchTypes } from '../types';
import { mutate } from 'swr';

interface QueueServiceFormProps {
  toggleSearchType: (searchMode: SearchTypes) => void;
  closePanel: () => void;
}

const QueueServiceForm: React.FC<QueueServiceFormProps> = ({ toggleSearchType, closePanel }) => {
  const { t } = useTranslation();
  const isTablet = useLayoutType() === 'tablet';
  const { serviceConcepts } = useServiceConcepts();
  const locations = useLocations();
  const [serviceName, setServiceName] = useState('');
  const [serviceConcept, setServiceConcept] = useState('');
  const [serviceDescription, setServiceDescription] = useState('');
  const [serviceLocation, setServiceLocation] = useState('');

  const createQueue = useCallback(
    (event) => {
      event.preventDefault();
      saveQueue(serviceName, serviceConcept, serviceDescription, serviceLocation, new AbortController()).then(
        ({ status }) => {
          if (status === 201) {
            showToast({
              title: t('addQueue', 'Add queue'),
              kind: 'success',
              description: t('queueAddedSuccessfully', 'Queue addeded successfully'),
            });
            closePanel();
            mutate(`/ws/rest/v1/queue?${serviceLocation}`);
          }
        },
        (error) => {
          showNotification({
            title: t('queueAddFailed', 'Error adding queue'),
            kind: 'error',
            critical: true,
            description: error?.message,
          });
        },
      );
    },
    [serviceConcept, serviceDescription, serviceLocation, serviceName, t],
  );

  return (
    <Form onSubmit={createQueue} className={styles.form}>
      <Stack gap={4} className={styles.grid}>
        <Column>
          <h3 className={styles.heading}>{t('addNewService', 'Add new service')}</h3>
          <Layer className={styles.input}>
            <TextInput
              id="serviceName"
              labelText={t('serviceName', 'Service Name')}
              onChange={(event) => setServiceName(event.target.value)}
              value={serviceName}
            />
          </Layer>
          <Layer className={styles.input}>
            <TextArea
              rows={3}
              id="serviceDescription"
              labelText={t('serviceDescriptione', 'Service Description')}
              onChange={(event) => setServiceDescription(event.target.value)}
              value={serviceDescription}
            />
          </Layer>

          <Layer className={styles.input}>
            <Select
              labelText={t('selectServiceConcept', 'Select a concept for the service')}
              id="serviceConcept"
              invalidText="Required"
              value={serviceConcept}
              onChange={(event) => setServiceConcept(event.target.value)}
              light>
              {!serviceConcept && <SelectItem text={t('selectServiceConcept', 'Select a concept for the service')} />}
              {serviceConcepts.length === 0 && <SelectItem text={t('noServicesAvailable', 'No services available')} />}
              {serviceConcepts?.length > 0 &&
                serviceConcepts.map((concept) => (
                  <SelectItem key={concept.uuid} text={concept.display} value={concept.uuid}>
                    {concept.display}
                  </SelectItem>
                ))}
            </Select>
          </Layer>

          <Layer className={styles.input}>
            <Select
              labelText={t('selectLocation', 'Select a location')}
              id="location"
              invalidText="Required"
              value={serviceLocation}
              onChange={(event) => setServiceLocation(event.target.value)}
              light>
              {!serviceLocation && <SelectItem text={t('selectLocation', 'Select a location')} />}
              {locations.length === 0 && <SelectItem text={t('noLocationsAvailable', 'No locations available')} />}
              {locations?.length > 0 &&
                locations.map((location) => (
                  <SelectItem key={location.uuid} text={location.display} value={location.uuid}>
                    {location.display}
                  </SelectItem>
                ))}
            </Select>
          </Layer>
        </Column>
      </Stack>
      <ButtonSet className={isTablet ? styles.tablet : styles.desktop}>
        <Button className={styles.button} kind="secondary" onClick={() => toggleSearchType(SearchTypes.BASIC)}>
          {t('cancel', 'Cancel')}
        </Button>
        <Button className={styles.button} kind="primary" type="submit">
          {t('save', 'Save')}
        </Button>
      </ButtonSet>
    </Form>
  );
};

export default QueueServiceForm;
