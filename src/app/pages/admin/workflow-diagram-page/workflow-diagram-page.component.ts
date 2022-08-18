import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StrongFBHttpService } from 'src/app/StrongFB/services/StrongFB-http.service';
import { StrongFBService } from 'src/app/StrongFB/services/StrongFB.service';
import { SettingsService } from 'src/app/services/settings.service';


declare var mermaid;

@Component({
  selector: 'admin-workflow-diagram-page',
  templateUrl: './workflow-diagram-page.component.html',
  styleUrls: ['./workflow-diagram-page.component.scss']
})
export class WorkflowDiagramPageComponent implements OnInit {
  startState: string;
  endState: string;
  workflowName: string;
  workflowVersion: number;
  states: {
    name: string;
    actions: { name: string; next_state?: string; meta?: { next_states?: string[] }; required_fields?: string[]; }[];
  }[];

  flowChartText: string;

  constructor(public strongfb: StrongFBService, private route: ActivatedRoute, private http: StrongFBHttpService) { }

  async ngOnInit() {
    // =>load params
    this.route.queryParams
      .subscribe(async (params) => {
        // console.log(params);

        // =>load workflow schema
        await this.loadSchema(params['name'], Number(params['version']));
      });

  }

  async loadSchema(name: string, version: number) {
    this.workflowName = name;
    this.workflowVersion = version;
    let res = await this.http.get('/admin/workflow/schema', {
      workflow_name: name,
      workflow_version: version,
    });
    let schema = res.result['data'];
    console.log('schema:', schema);
    this.startState = schema['start_state'];
    this.endState = schema['end_state'];
    this.states = schema['states'];
    this.generateFLowChart();
  }


  async generateFLowChart() {

    // await this.strongfb.loadScript('./assets/raphael.sketchpad.js');

    let flowChart = `
    flowchart TD`;
    let flowLines: { src: string; connector?: string; dest: string; data?: any; type?: 'normal' | 'dot'; block: 'condition' | 'input'; fields?: string[] }[] = [];
    // =>iterate states from start
    let currentState = this.states.find(i => i.name === this.startState);
    // flowLines.push({ src: 'start_workflow', dest: currentState.name });
    let nextStates = [];
    let counter = 0;
    let max = 20000;
    while (true) {
      // =>iterate actions of state
      for (const action of currentState.actions) {
        // =>add request fields from user
        if (action.required_fields && action.required_fields.length > 0) {
          for (const field of action.required_fields) {
            flowLines.push({ src: field, connector: 'request field', dest: currentState.name, data: action, block: 'input' });

          }
        }
        let actionNextStates = [];
        let isPossible = false;
        if (action.next_state) {
          actionNextStates.push(action.next_state);
        } else if (action?.meta?.next_states) {
          isPossible = true;
          actionNextStates = action?.meta.next_states;
        } else {
          console.warn('no have next state!')
        }
        // =>add state
        for (const Nstate of actionNextStates) {
          if (flowLines.find(i => i.src === currentState.name && i.dest === Nstate && i.connector === action.name)) {
            continue;
          }

          // =>add action as condition
          flowLines.push({ src: currentState.name, connector: action.name, dest: Nstate, data: action, type: isPossible ? 'dot' : 'normal', block: 'condition' });
          nextStates.push(Nstate);
        }
      }

      if (nextStates.length === 0) {
        break;
      } else {
        let next = nextStates.shift();
        currentState = this.states.find(i => i.name === next);
      }
      counter++;
      if (counter > max) break;
    }

    // =>convert flow lines to flow chart
    for (const line of flowLines) {
      let dest = line.dest;
      let src = line.src;
      // =>check for end state
      if (line.dest === this.endState) {
        dest = `${line.dest}(((${line.dest})))`;
      }
      // =>check for start state
      if (line.src === this.startState) {
        src = `${line.src}(((${line.src})))`;
      }

      if (line.type === 'normal') {
        if (line.connector) {
          flowChart += `\n${src}-- ${line.connector} -->${dest}`;
        } else {
          flowChart += `\n${src} --> ${dest}`;
        }
      } else if (line.type === 'dot') {
        if (line.connector) {
          flowChart += `\n${src}-. ${line.connector} .->${dest}`;
        }
      }
      if (line.block === 'input') {
        flowChart += `\ninput_${Math.ceil(Math.random() * 1000000)}[/${line.src}/] --- ${line.dest}`
      }
      // if (line.data) {
      //   flowChart += `\nclick ${src} call stateInfo() "hello"`
      // }
    }

    var config = {
      startOnLoad: true,
      theme: "dark",
      themeCSS: ".edgeLabel { color: #d4eced; background: #1b1b37 }",
      fontFamily: "monospace",
      // logLevel: "info",
      flowchart: {
        useMaxWidth: true,
        htmlLabels: true,
        curve: 'basis',
        fontSize: 20,
        sectionFontSize: 14,
      },
      securityLevel: 'antiscript',
      wrap: true,
    };
    this.flowChartText = flowChart;
    await this.strongfb.loadScript(SettingsService.ASSETS_BASE_URL + '/mermaid.min.js');
    await mermaid.initialize(config);
    var cb = function (svgGraph) {
      document.getElementById("mermaid_flowchart").innerHTML = svgGraph;
    }
    mermaid.render("id1", this.flowChartText, cb);
    console.log('flowChart:', flowChart, counter)
  }


  export() {
    let svg = document.getElementById("mermaid_flowchart").firstChild['outerHTML'] as string;
    // =>replace font-size
    svg = svg.replace(/font\-size\:16px\;/g, 'font-size:11px;');
    // =>replace text color
    svg = svg.replace(/.edgeLabel{color:#d4eced;background:#1b1b37;}/g, `.edgeLabel{color:#0c0c0c;background:#ffff;}`);
    svg = svg.replace(/fill:#1f2020;/g, `fill: #2e0b74;`);

    console.log('svg:', svg);
    var svgFile = new Blob([svg], {
      type: "image/svg+xml;charset=utf-8"
    });

    var domUrl = window.URL || window.webkitURL || window;
    var url = domUrl['createObjectURL'](svgFile);
    console.log(url)
    // this.svgToPng(svg)
    var a = document.createElement('a');

    a.download = `${this.workflowName}@${this.workflowVersion}-flow-chart.svg`;
    a.href = url;

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

}
