import { Results } from '../../src/app/_models/results';
import { PluginStatus, TaskState, WorkflowExecution, WorkflowStatus } from '../../src/app/_models/workflow-execution';

export const finishedExecutions: Results<WorkflowExecution[]> = {
  'results': [
      {
          'id': '5bea8f7e729e6f000d3a8765',
          'datasetId': '58',
          'workflowStatus': WorkflowStatus.FINISHED,
          'cancelling': false,
          'createdDate': '2018-11-13T08:46:54.373Z',
          'startedDate': '2018-11-13T08:46:54.476Z',
          'updatedDate': '2018-11-13T08:47:32.003Z',
          'finishedDate': '2018-11-13T08:47:32.008Z',
          'metisPlugins': [
              {
                  'pluginType': 'OAIPMH_HARVEST',
                  'id': '5bea8f7e729e6f000d3a8764-OAIPMH_HARVEST',
                  'pluginStatus': PluginStatus.FINISHED,
                  'startedDate': '2018-11-13T08:46:54.476Z',
                  'updatedDate': '2018-11-13T08:47:32.003Z',
                  'finishedDate': '2018-11-13T08:47:32.008Z',
                  'externalTaskId': '-138550145322300154',
                  'executionProgress': {
                      'expectedRecords': 760,
                      'processedRecords': 760,
                      'progressPercentage': 100,
                      'errors': 0,
                      'status': TaskState.PROCESSED
                  },
                  'pluginMetadata': {
                      'pluginType': 'OAIPMH_HARVEST',
                      'mocked': false,
                      'enabled': true,
                      'revisionNamePreviousPlugin': null,
                      'revisionTimestampPreviousPlugin': null,
                      'url': 'https://oai-pmh.eanadev.org/oai',
                      'metadataFormat': 'edm',
                      'setSpec': '2021006',
                      'fromDate': null,
                      'untilDate': null,
                      'datasetId': '58',
                      'useDefaultIdentifiers': false,
                      'identifierPrefixRemoval': null
                  },
                  'topologyName': 'oai_harvest'
              }
          ]
      },
      {
          'id': '5be15e85bbcf53000795bd9c',
          'datasetId': '58',
          'workflowStatus': WorkflowStatus.FINISHED,
          'cancelling': false,
          'createdDate': '2018-11-06T09:27:33.075Z',
          'startedDate': '2018-11-06T09:27:33.240Z',
          'updatedDate': '2018-11-06T09:27:49.743Z',
          'finishedDate': '2018-11-06T09:27:49.748Z',
          'metisPlugins': [
              {
                  'pluginType': 'PUBLISH',
                  'id': '5be15e85bbcf53000795bd9b-PUBLISH',
                  'pluginStatus': PluginStatus.FINISHED,
                  'startedDate': '2018-11-06T09:27:33.240Z',
                  'updatedDate': '2018-11-06T09:27:49.743Z',
                  'finishedDate': '2018-11-06T09:27:49.748Z',
                  'externalTaskId': '-520556239275801744',
                  'executionProgress': {
                      'expectedRecords': 760,
                      'processedRecords': 760,
                      'progressPercentage': 100,
                      'errors': 0,
                      'status': TaskState.PROCESSED
                  },
                  'pluginMetadata': {
                      'pluginType': 'PUBLISH',
                      'mocked': false,
                      'enabled': true,
                      'revisionNamePreviousPlugin': 'PREVIEW',
                      'revisionTimestampPreviousPlugin': '2018-09-06T11:44:53.181Z',
                      'datasetId': '58',
                      'useAlternativeIndexingEnvironment': false,
                      'preserveTimestamps': false
                  },
                  'topologyName': 'indexer'
              }
          ]
      },
      {
          'id': '5be0642d32251400094e50fe',
          'datasetId': '58',
          'workflowStatus': WorkflowStatus.FINISHED,
          'cancelling': false,
          'createdDate': '2018-11-05T15:39:25.617Z',
          'startedDate': '2018-11-05T15:39:25.652Z',
          'updatedDate': '2018-11-05T15:39:41.395Z',
          'finishedDate': '2018-11-05T15:39:41.404Z',
          'metisPlugins': [
              {
                  'pluginType': 'PUBLISH',
                  'id': '5be0642d32251400094e50fd-PUBLISH',
                  'pluginStatus': PluginStatus.FINISHED,
                  'startedDate': '2018-11-05T15:39:25.652Z',
                  'updatedDate': '2018-11-05T15:39:41.395Z',
                  'finishedDate': '2018-11-05T15:39:41.404Z',
                  'externalTaskId': '9184301598493985608',
                  'executionProgress': {
                      'expectedRecords': 760,
                      'processedRecords': 760,
                      'progressPercentage': 100,
                      'errors': 0,
                      'status': TaskState.PROCESSED
                  },
                  'pluginMetadata': {
                      'pluginType': 'PUBLISH',
                      'mocked': false,
                      'enabled': true,
                      'revisionNamePreviousPlugin': 'PREVIEW',
                      'revisionTimestampPreviousPlugin': '2018-09-06T11:44:53.181Z',
                      'datasetId': '58',
                      'useAlternativeIndexingEnvironment': false,
                      'preserveTimestamps': false
                  },
                  'topologyName': 'indexer'
              }
          ]
      },
      {
          'id': '5be063ea32251400094e50fc',
          'datasetId': '58',
          'workflowStatus': WorkflowStatus.FINISHED,
          'cancelling': false,
          'createdDate': '2018-11-05T15:38:18.344Z',
          'startedDate': '2018-11-05T15:38:18.450Z',
          'updatedDate': '2018-11-05T15:38:40.101Z',
          'finishedDate': '2018-11-05T15:38:40.105Z',
          'metisPlugins': [
              {
                  'pluginType': 'PUBLISH',
                  'id': '5be063ea32251400094e50fb-PUBLISH',
                  'pluginStatus': PluginStatus.FINISHED,
                  'startedDate': '2018-11-05T15:38:18.450Z',
                  'updatedDate': '2018-11-05T15:38:40.101Z',
                  'finishedDate': '2018-11-05T15:38:40.105Z',
                  'externalTaskId': '6889126589844441553',
                  'executionProgress': {
                      'expectedRecords': 760,
                      'processedRecords': 760,
                      'progressPercentage': 100,
                      'errors': 0,
                      'status': TaskState.PROCESSED
                  },
                  'pluginMetadata': {
                      'pluginType': 'PUBLISH',
                      'mocked': false,
                      'enabled': true,
                      'revisionNamePreviousPlugin': 'PREVIEW',
                      'revisionTimestampPreviousPlugin': '2018-09-06T11:44:53.181Z',
                      'datasetId': '58',
                      'useAlternativeIndexingEnvironment': false,
                      'preserveTimestamps': false
                  },
                  'topologyName': 'indexer'
              }
          ]
      },
      {
          'id': '5be05f9832251400094e50fa',
          'datasetId': '80',
          'workflowStatus': WorkflowStatus.FAILED,
          'cancelling': false,
          'createdDate': '2018-11-05T15:19:52.791Z',
          'startedDate': '2018-11-05T15:19:52.863Z',
          'updatedDate': '2018-11-05T15:20:13.549Z',
          'finishedDate': undefined,
          'metisPlugins': [
              {
                  'pluginType': 'OAIPMH_HARVEST',
                  'id': '5be05f9832251400094e50f9-OAIPMH_HARVEST',
                  'pluginStatus': PluginStatus.FAILED,
                  'startedDate': '2018-11-05T15:19:52.863Z',
                  'updatedDate': '2018-11-05T15:20:13.549Z',
                  'finishedDate': undefined,
                  'externalTaskId': '-8670244063443531419',
                  'executionProgress': {
                      'expectedRecords': 0,
                      'processedRecords': 0,
                      'progressPercentage': 0,
                      'errors': 0,
                      'status': TaskState.DROPPED
                  },
                  'pluginMetadata': {
                      'pluginType': 'OAIPMH_HARVEST',
                      'mocked': false,
                      'enabled': true,
                      'revisionNamePreviousPlugin': null,
                      'revisionTimestampPreviousPlugin': null,
                      'url': 'http://panic.image.ntua.gr:9000/photography/oai',
                      'metadataFormat': 'rdf',
                      'setSpec': '1021',
                      'fromDate': null,
                      'untilDate': null,
                      'datasetId': '80',
                      'useDefaultIdentifiers': false,
                      'identifierPrefixRemoval': null
                  },
                  'topologyName': 'oai_harvest'
              }
          ]
      }
  ],
  'listSize': 5,
  'nextPage': -1
};