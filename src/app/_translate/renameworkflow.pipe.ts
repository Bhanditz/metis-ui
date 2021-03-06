import { Pipe, PipeTransform } from '@angular/core';

const workflowNames: { [key: string]: string } = {
  ENRICHMENT: 'Enrich',
  HARVEST: 'Import',
  HTTP_HARVEST: 'Import HTTP',
  LINK_CHECKING: 'Check Links',
  MEDIA_PROCESS: 'Process Media',
  NORMALIZATION: 'Normalise',
  OAIPMH_HARVEST: 'Import OAI-PMH',
  PREVIEW: 'Preview',
  PUBLISH: 'Publish',
  TRANSFORMATION: 'Transform',
  VALIDATION_EXTERNAL: 'Validate (EDM external)',
  VALIDATION_INTERNAL: 'Validate (EDM internal)',
};

@Pipe({
  name: 'renameWorkflow',
})
export class RenameWorkflowPipe implements PipeTransform {
  transform(value: string): string {
    return workflowNames[value];
  }
}
