import { formEntrySub } from './form-entry';
import { launchPatientChartWithWorkspaceOpen } from './workspaces';

export function launchFormEntry(formUuid: string, patientUuid: string, encounterUuid?: string, formName?: string) {
  formEntrySub.next({ formUuid, encounterUuid });
  launchPatientChartWithWorkspaceOpen({
    patientUuid: patientUuid,
    workspaceName: 'patient-form-entry-workspace',
    dashboardName: null,
    additionalProps: {
      workspaceTitle: 'Triage Form',
    },
  });
}
