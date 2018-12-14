import { Component, EventEmitter, Input, Output } from '@angular/core';

import { copyExecutionAndTaskId } from '../../_helpers';
import {
  getCurrentPlugin,
  PluginExecution,
  PluginStatus,
  Report,
  ReportRequest,
  WorkflowExecution,
  WorkflowStatus,
} from '../../_models';
import { WorkflowService } from '../../_services';

@Component({
  selector: 'app-lastexecution',
  templateUrl: './lastexecution.component.html',
  styleUrls: ['./lastexecution.component.scss'],
})
export class LastExecutionComponent {
  constructor(private workflows: WorkflowService) {}

  @Input() datasetId: string;

  @Output() setReportRequest = new EventEmitter<ReportRequest | undefined>();

  report?: Report;
  pluginExecutions: PluginExecution[] = [];
  currentPlugin?: PluginExecution;

  @Input()
  set lastExecutionData(value: WorkflowExecution | undefined) {
    if (value) {
      this.workflows.getReportsForExecution(value);

      const { workflowStatus } = value;
      if (
        workflowStatus === WorkflowStatus.FINISHED ||
        workflowStatus === WorkflowStatus.FAILED ||
        workflowStatus === WorkflowStatus.CANCELLED
      ) {
        this.currentPlugin = undefined;
      } else {
        this.currentPlugin = getCurrentPlugin(value);
      }

      this.pluginExecutions = value.metisPlugins.slice();
      this.pluginExecutions.reverse();
    }
  }

  //  scroll to specific point in page after click
  scroll(el: Element): void {
    el.scrollIntoView({ behavior: 'smooth' });
  }

  openReport(taskId: string, topology: string): void {
    this.setReportRequest.emit({ taskId, topology });
  }

  // after double clicking, copy the execution and task id to the clipboard
  copyInformation(type: string, id1: string, id2: string): void {
    copyExecutionAndTaskId(type, id1, id2);
  }

  getPluginStatusClass(plugin: PluginExecution): string {
    const { executionProgress, pluginStatus } = plugin;
    if (
      executionProgress.errors > 0 &&
      (pluginStatus === PluginStatus.FINISHED || pluginStatus === PluginStatus.CANCELLED)
    ) {
      return 'status-warning';
    } else if (plugin !== this.currentPlugin && pluginStatus === PluginStatus.INQUEUE) {
      return 'status-scheduled';
    } else {
      return `status-${pluginStatus.toString().toLowerCase()}`;
    }
  }

  byId(_: number, item: { id: string }): string {
    return item.id;
  }
}
