import React from 'react';
import { Tabs, Tab, Button } from 'carbon-components-react';
import styles from './appointment-list.scss';
import { useTranslation } from 'react-i18next';
import Calendar16 from '@carbon/icons-react/es/calendar/16';
import BookedAppointments from '../tabs/booked-appointments-table.component';
import CompletedAppointments from '../tabs/completed-appointments-table.component';

const AppointmentList: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className={styles.appointmentList}>
      <Button
        className={styles.calendarButton}
        kind="primary"
        renderIcon={Calendar16}
        data-floating-menu-primary-focus
        iconDescription={t('viewCalendar', 'View Calendar')}>
        {t('viewCalendar', 'View Calendar')}
      </Button>

      <Tabs className={styles.tabs} type="container">
        <Tab label={t('bookedForToday', 'Booked for today')}>
          <BookedAppointments />
        </Tab>
        <Tab label={t('cancelled', 'Cancelled')}>
          <BookedAppointments />
        </Tab>
        <Tab label={t('completed', 'Completed')}>
          <CompletedAppointments />
        </Tab>
      </Tabs>
    </div>
  );
};

export default AppointmentList;
