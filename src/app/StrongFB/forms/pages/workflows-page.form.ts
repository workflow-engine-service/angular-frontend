import { StrongFBFormClass } from "../../common/StrongFB-base";
import { StrongFBLayoutBuilder } from "../../common/StrongFB-layout-builder";
import { StrongFBButtonWidget } from "../../widgets/button/button.header";
import { TableColumnAction, TableTagColumnMapValue } from "../../widgets/table/table-interfaces";
import { StrongFBTableWidget } from "../../widgets/table/table.header";

type widgets = 'workflowsTable' | 'refreshButton';

type TableColumns = 'index' | 'workflow_name' | 'workflow_version' | 'started_at' | 'ended_at' | 'success' | 'options';



export class WorkflowsPageForm extends StrongFBFormClass<widgets> {

    override get layout() {
        return this.layoutBuilder().columnBox().layout([
            this.layoutBuilder().gridBox()
                .gridColumnLayout({ desktop: 'col-9' }, this.layoutBuilder().box({ html: `<h1>Workflows</h1>` }).finish())
                .gridColumnLayout({ desktop: 'col-3' }, this.layoutBuilder().rowBox().styleCss('flex-direction', 'row-reverse').widget(this.refreshButton).finish())
                .finish(),
            this.layoutBuilder().box().widget(this.workersTable).finish(),
        ]).finish()
    }

    refreshButton() {
        return new StrongFBButtonWidget().icon('refresh-outline').mode('iconButton').appearance('colorful').status('warning').click(() => {
            this.findWidgetByName<StrongFBTableWidget>('workflowsTable').updateRows();
        });
    }

    workersTable() {
        return new StrongFBTableWidget<TableColumns>().columns([
            { name: 'index', title: '#' },
            { name: 'workflow_name', title: 'Name' },
            { name: 'workflow_version', title: 'Version' },
            // { name: 'started_at', title: 'Started At' },
            // { name: 'ended_at', title: 'Ended At' },
            // { name: 'success', title: 'Result', type: 'tag' },
            { name: 'options', title: 'Options', type: 'actions' },
        ]).mapColumnValue('index', (row, i) => {
            return i + 1;
        }).loadRowsByApi({
            path: '/workflow/deployed-list',
            method: 'GET'
        }, (res, err) => {
            if (err) {
                console.warn('error:', err);
                return [];
            }
            console.log('res:', res['data'])
            return res['data'];
        }).mapPaginationByApi({
            pageCountResponse: 'pagination.page_count'
        })
            .mapActionsColumn('options', [
                {
                    mode: 'icon',
                    icon: 'crop-outline',
                    text: 'Visualize',
                    status: 'primary',
                    action: (row, i, self) => {
                        this.service.goToPage(`/admin/workflow/visualize?name=${row['workflow_name']}&version=${row['workflow_version']}`)
                    }
                },
                // {
                //     mode: 'icon',
                //     icon: 'archive-outline',
                //     text: 'History',
                //     status: 'primary',
                //     disabled: true,
                //     action: (row, i, self) => {
                //         alert('hello history');
                //     }
                // },
            ]);
    }

}