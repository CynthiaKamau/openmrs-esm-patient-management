import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Button,
  ButtonSet,
  Switch,
  ContentSwitcher,
  RadioTile,
  TileGroup,
  DataTableSkeleton,
} from 'carbon-components-react';
import ArrowLeft24 from '@carbon/icons-react/es/arrow--left/24';
import { formatDatetime, useLayoutType, parseDate } from '@openmrs/esm-framework';
import { SearchTypes } from '../types';
import styles from './patient-scheduled-visits.scss';
import { useRecentScheduledVisits, useFutureScheduledVisits } from './patient-scheduled-visits.resource';
interface PatientSearchProps {
  toggleSearchType: (searchMode: SearchTypes) => void;
  patientUuid: string;
}

enum priority {
  NOT_URGENT = 'Not urgent',
  PRIORITY = 'Priority',
  EMERGENCY = 'Emergency',
}

const PatientRecentScheduledVisits: React.FC<{ recentVisits; isLoading }> = ({ recentVisits, isLoading }) => {
  const { t } = useTranslation();
  const [showRecentPriority, setShowRecentPriority] = useState(false);
  const [recentPrioritySwitcherValue, setRecentPrioritySwitcherValue] = useState(0);
  const [recentVisitsIndex, setRecentVisitsIndex] = useState(0);

  if (isLoading) {
    return <DataTableSkeleton role="progressbar" />;
  }
  if (recentVisits) {
    return (
      <div>
        {recentVisits.length >= 1 ? (
          <div className={styles.row}>
            <p className={styles.heading}>{t('recentScheduledVisits', { count: recentVisits.length })} </p>
            <TileGroup name="tile-group" defaultSelected="forever" className="trigger-tile">
              {recentVisits.map((visit, index) => (
                <RadioTile
                  id={visit.id}
                  value={visit.id}
                  key={visit.id}
                  className={styles.visitTile}
                  onClick={() => {
                    setShowRecentPriority(true);
                    setRecentVisitsIndex(index);
                  }}>
                  <div className={styles.helperText}>
                    <p className={styles.primaryText}>{visit.visit_type}</p>
                    <p className={styles.secondaryText}>
                      {' '}
                      {formatDatetime(parseDate(visit?.visit_date))} · {visit.clinic}{' '}
                    </p>
                    {showRecentPriority && index == recentVisitsIndex ? (
                      <ContentSwitcher
                        size="sm"
                        className={styles.prioritySwitcher}
                        onChange={({ index }) => {
                          setRecentPrioritySwitcherValue(index);
                        }}>
                        <Switch
                          name={priority.NOT_URGENT}
                          text={t('notUrgent', 'Not Urgent')}
                          value={recentPrioritySwitcherValue}
                        />
                        <Switch
                          name={priority.PRIORITY}
                          text={t('priority', 'Priority')}
                          value={recentPrioritySwitcherValue}
                        />
                        <Switch
                          name={priority.EMERGENCY}
                          text={t('emergency', 'Emergency')}
                          value={recentPrioritySwitcherValue}
                        />
                      </ContentSwitcher>
                    ) : null}
                  </div>
                </RadioTile>
              ))}
            </TileGroup>
          </div>
        ) : (
          '--'
        )}
      </div>
    );
  }
};

const PatientFutureScheduledVisits: React.FC<{ futureVisits; isLoading }> = ({ futureVisits, isLoading }) => {
  const { t } = useTranslation();
  const [futurePrioritySwitcherValue, setFuturePrioritySwitcherValue] = useState(0);
  const [futureVisitsIndex, setFutureVisitsIndex] = useState(0);
  const [show_future_priority, setShowFuturePriority] = useState(false);

  if (isLoading) {
    return <DataTableSkeleton role="progressbar" />;
  }

  if (futureVisits) {
    return (
      <div>
        {futureVisits.length >= 1 ? (
          <div className={styles.row}>
            <p className={styles.heading}>{t('futureScheduledVisits', { count: futureVisits.length })} </p>
            <TileGroup name="tile-group" defaultSelected="default-selected">
              {futureVisits.map((visit, ind) => (
                <RadioTile
                  value={visit.id}
                  key={visit.id}
                  className={styles.visitTile}
                  onClick={() => {
                    setShowFuturePriority(true);
                    setFutureVisitsIndex(ind);
                  }}>
                  <div className={styles.helperText}>
                    <p className={styles.primaryText}>{visit.visit_type}</p>
                    <p className={styles.secondaryText}>
                      {' '}
                      {formatDatetime(parseDate(visit?.visit_date))} · {visit.clinic}{' '}
                    </p>

                    {show_future_priority && ind == futureVisitsIndex ? (
                      <ContentSwitcher
                        size="sm"
                        className={styles.prioritySwitcher}
                        onChange={({ index }) => setFuturePrioritySwitcherValue(index)}>
                        <Switch
                          name={priority.NOT_URGENT}
                          text={t('notUrgent', 'Not Urgent')}
                          value={futurePrioritySwitcherValue}
                        />
                        <Switch
                          name={priority.PRIORITY}
                          text={t('priority', 'Priority')}
                          value={futurePrioritySwitcherValue}
                        />
                        <Switch
                          name={priority.EMERGENCY}
                          text={t('emergency', 'Emergency')}
                          value={futurePrioritySwitcherValue}
                        />
                      </ContentSwitcher>
                    ) : null}
                  </div>
                </RadioTile>
              ))}
            </TileGroup>
          </div>
        ) : (
          '--'
        )}
      </div>
    );
  }
};

const PatientScheduledVisits: React.FC<PatientSearchProps> = ({ toggleSearchType, patientUuid }) => {
  const { t } = useTranslation();
  const isTablet = useLayoutType() === 'tablet';
  const { recentVisits, isLoading } = useRecentScheduledVisits(patientUuid);
  const { futureVisits, loading } = useFutureScheduledVisits(patientUuid);

  return (
    <div className={styles.container}>
      <div className={styles.backButton}>
        <Button
          kind="ghost"
          renderIcon={ArrowLeft24}
          iconDescription="Back to search results"
          size="sm"
          onClick={() => toggleSearchType(SearchTypes.BASIC)}>
          <span>{t('backToSearchResults', 'Back to search results')}</span>
        </Button>
      </div>

      <PatientRecentScheduledVisits recentVisits={recentVisits} isLoading={isLoading} />
      <PatientFutureScheduledVisits futureVisits={futureVisits} isLoading={loading} />

      <div className={styles['text-divider']}>{t('or', 'Or')}</div>

      <div className={styles.buttonContainer}>
        <Button kind="ghost" iconDescription="Start another visit type">
          {t('anotherVisitType', 'Start another visit type')}
        </Button>
      </div>

      <ButtonSet className={isTablet ? styles.tablet : styles.desktop}>
        <Button className={styles.button} kind="secondary" onClick={() => toggleSearchType(SearchTypes.BASIC)}>
          {t('cancel', 'Cancel')}
        </Button>
        <Button className={styles.button} kind="primary" type="submit">
          {t('search', 'Search')}
        </Button>
      </ButtonSet>
    </div>
  );
};

export default PatientScheduledVisits;
