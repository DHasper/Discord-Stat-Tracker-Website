import { Component, OnInit, ViewChild } from '@angular/core';
import { RestService } from 'src/app/shared/rest.service';
import { DataService } from 'src/app/shared/data.service';
import { Label,  BaseChartDirective, Color } from 'ng2-charts';
import { ChartDataSets } from 'chart.js';

@Component({
  selector: 'app-server',
  templateUrl: './server.component.html',
  styleUrls: ['./server.component.css']
})
export class ServerComponent implements OnInit {

  // timebar
  public selectableTimes = ["All time", "Yearly", "Monthly", "Weekly", "Daily"];
  public selectedTime: string = 'Weekly';
  public selectedTimeMinutes: number = 0;

  // data
  private selectedMessageData;
  private messageData;

  // Messages per hour chart data
  msgPerHourOptions: any = {
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero:true
        }
      }]
    },
    responsive: true,
    maintainAspectRatio: false
  };
  public msgPerHourData: ChartDataSets[] = [
    { data: [], label: 'All messages' },
    { data: [], label: 'Messages with attachments' },
    { data: [], label: 'Messages marked as meme' },
  ];
  public msgPerHourLabels: Label[] = [];
  public msgPerHourColors: Color[] = [
    {
      backgroundColor: 'rgb(169, 76, 98)'
    },
    {
      backgroundColor: 'rgb(48, 114, 160)'
    },
    {
      backgroundColor: 'rgb(76, 169, 98)'
    }
  ]

  // message chart data
  public msgData: ChartDataSets[] = [
    { data: [], label: 'Messages'}
  ]
  public msgLabels: Label[] = [];

  // channel barchart data
  public channelData: ChartDataSets[] = [
    { data: [], label: 'Messages'}
  ];
  public channelLabels: Label[] = [];

  // Text information data
  public earliestDate: string;
  public totalMessages: number;
  public totalMemes: number;
  public totalFiles: number;
  public totalDays: number;

  // messages vs memes pie chart data
  public msgmemeData: number[] = [1, 1];
  public msgmemeLabels: string[] = ['Messages without memes', 'Messages with memes'];
  public msgmemeColors = [
    {
      backgroundColor: ['rgb(169, 76, 98)', 'rgb(76, 169, 98)'],
    },
  ];
  msgmemeOptions: any = {
    responsive: true,
    maintainAspectRatio: false
  };

  constructor(
    private rest: RestService,
    private data: DataService
  ) { }

  @ViewChild(BaseChartDirective) chart: BaseChartDirective;

  ngOnInit(): void {
    this.updateData();
  }

  updateData(): void {
    const guild = JSON.parse(this.data.getDetails());

    this.rest.getRequest("").then( res => {
        if(res){
          // get messages per hour
          this.rest.getRequest(`/stats/${guild.id}/messages`).then( messages => {
            if(messages){
              this.messageData = Array.from(messages);

              // update the graphs when we have new data
              this.updateGraphs();
            }
          });
        }
    });
  }

  async updateGraphs(): Promise<void> {

    const curDate = new Date();

    // reset temp data
    // we need the temp data to make the ng2-graph animation not reset every update
    let msgPerHourTempData = [[], [], []];
    for(let i=0; i<24; i++){
      msgPerHourTempData.forEach( arr => {
        arr.push(0);
      });
    }

    let firstDate = new Date();
    let totalMessages = 0;
    let totalMemes = 0;
    let totalFiles = 0;
    let totalNonMemes = 0;
    let msgData = {};
    let channelData = {};

    // reset and set labels
    this.msgPerHourLabels = [];
    let msgPerHourLabel = new Date().getHours()+1;
    for(let i=0; i<24; i++){
      if(msgPerHourLabel > 23) msgPerHourLabel = 0;
      this.msgPerHourLabels.push(this.formatHour(msgPerHourLabel));
      msgPerHourLabel++;
    }

    let msgLabels = [];
    switch(this.selectedTime) {
      case 'All time': {
        this.selectedTimeMinutes = 0;
        // TODO: for now we display all time the same way as yearly
        let date = new Date();
        date.setMonth(date.getMonth() - 11);
        for(let i=0; i<12; i++){
          msgData[(date.getMonth() + "-" + date.getFullYear())] = 0;
          msgLabels.push(this.formatDateYear(date));
          date.setMonth(date.getMonth() + 1);
        }
        break;
      }
      case 'Yearly': {
        this.selectedTimeMinutes = 525600;
        let date = new Date();
        date.setMonth(date.getMonth() - 11);
        for(let i=0; i<12; i++){
          msgData[(date.getMonth() + "-" + date.getFullYear())] = 0;
          msgLabels.push(this.formatDateYear(date));
          date.setMonth(date.getMonth() + 1);
        }
        break
      }
      case 'Monthly': {
        this.selectedTimeMinutes = 43200;
        let date = new Date();
        date.setDate(date.getDate() - 29);
        for(let i=0; i<30; i++){
          msgData[(date.getDate() + "-" + date.getMonth())] = 0;
          msgLabels.push(this.formatDateShort(date));
          date.setDate(date.getDate() + 1);
        }
        break;
      }
      case 'Weekly': {
        this.selectedTimeMinutes = 10080;
        let date = new Date();
        date.setDate(date.getDate() - 6);
        for(let i=0; i<7; i++){
          msgData[(date.getDate() + "-" + date.getMonth())] = 0;
          msgLabels.push(this.formatDateShort(date));
          date.setDate(date.getDate() + 1);
        }
        break;
      }  
      case 'Daily': {
        this.selectedTimeMinutes = 1440;
        let msgLabel = new Date().getHours()+1;
        for(let i=0; i<24; i++){
          msgData[i] = 0;
          if(msgLabel > 23) msgLabel = 0;
          msgLabels.push(this.formatHour(msgLabel));
          msgLabel++;
        }
        break;
      }
    }

    // get message data for the selected time
    this.selectedMessageData = [];
    const curTime = Math.round((curDate.getTime() / 1000) / 60);
    this.messageData.forEach(message => {
      const messageDate = new Date(message.date);
      const messageTime = Math.round((messageDate.getTime() / 1000) / 60);
      const timediff = curTime - messageTime;

      if(this.selectedTimeMinutes == 0 || timediff < this.selectedTimeMinutes){
        this.selectedMessageData.push(message);
      }
    });

    // do some counting and fill temp data
    this.selectedMessageData.forEach(message => {

      if(message.date == null) return;

      // get the hour and graph index
      const messageDate = new Date(message.date);
      const hour = messageDate.getHours();
      const channel = message.channel;
      let hourIndex = hour - curDate.getHours() - 1;
      let dayMonthIndex = messageDate.getDate() + '-' + messageDate.getMonth();
      let monthYearIndex = messageDate.getMonth() + '-' + messageDate.getFullYear();
      if(hourIndex < 0) hourIndex = hourIndex + 24;

      // increment data
      totalMessages++;
      msgPerHourTempData[0][hourIndex]++;
      if(this.selectedTime == 'Daily') msgData[hourIndex]++;
      if(this.selectedTime == 'Weekly') msgData[dayMonthIndex]++;
      if(this.selectedTime == 'Monthly') msgData[dayMonthIndex]++;
      if(this.selectedTime == 'Yearly') msgData[monthYearIndex]++;
      if(this.selectedTime == 'All time') msgData[monthYearIndex]++;

      // check if message contains file
      if(message.hasFile){
        msgPerHourTempData[1][hourIndex]++;
        totalFiles++;
      }

      // check if message contains meme
      if(message.meme){
        msgPerHourTempData[2][hourIndex]++;
        totalMemes++;
      } else {
        totalNonMemes++;
      }

      // increment for channel
      if(channelData[channel] == null){
        channelData[channel] = 1;
      } else {
        channelData[channel]++;
      }

      // find date of earliest message
      if(messageDate < firstDate) firstDate = messageDate
    });

    // set how many days we should use to display data
    if(this.selectedTime == 'Daily') this.totalDays = 1;
    else if(this.selectedTime == 'Weekly') this.totalDays = 7;
    else if(this.selectedTime == 'Monthly') this.totalDays = 30;
    else if(this.selectedTime == 'Yearly') this.totalDays = 365;
    else this.totalDays = Math.floor(curDate.getTime()/8.64e7) - Math.floor(firstDate.getTime()/8.64e7);

    // convert msgperhour data to averages
    for(let o=0; o<msgPerHourTempData.length; o++){
      for(let i=0; i<msgPerHourTempData[o].length; i++){
        const n = msgPerHourTempData[o][i];
        msgPerHourTempData[o][i] = Math.round((n / this.totalDays) * 100) / 100;
      }
    }

    // do get requests to the rest api to get channel names for the ids
    let tempChannelData = [];
    let channelLabels = [];
    for(let key in channelData){
      tempChannelData.push(channelData[key]);

      // get channel names from rest api
      await this.rest.getRequest(`/channel/${key}`).then( res => {
        if(res) channelLabels.push(res.name);
      });
    }

    // sort channel data
    const channelObj = channelLabels.map(function(l, i) {
      return {
        label: l,
        data: tempChannelData[i] || 0
      };
    });
    const sortedChannelObj = channelObj.sort( (a, b) => {
      return b.data - a.data;
    } );

    // the following part copies temporary vars to the ones displayed in the view
    // messages per hour graph
    for(let i = 0; i < 3; i++){
      this.msgPerHourData[i].data = Array.from(msgPerHourTempData[i]);
    }

    // msg vs meme pie chart
    this.msgmemeData = [totalNonMemes, totalMemes];

    // general info
    this.totalFiles = totalFiles;
    this.totalMemes = totalMemes;
    this.totalMessages = totalMessages;
    this.earliestDate = this.formatDateClean(firstDate);
    
    // total messages line graph
    let tempMsgData = [];
    for(let key in msgData){
      tempMsgData.push(msgData[key]);
    }
    this.msgData[0].data = Array.from(tempMsgData);
    this.msgLabels = Array.from(msgLabels);

    // messages per channel bar chart
    this.channelData[0].data = [];
    this.channelLabels = [];
    sortedChannelObj.forEach( obj => {
      this.channelLabels.push(obj.label);
      this.channelData[0].data.push(obj.data);
    })

    // update the graphs
    this.chart.update();
  }

  formatHour(time: number): string {
    if(time == 12) {
      return time + " pm"
    }
    if(time == 0) {
      return 12 + " am"
    }
    if(time <= 11){
      return time + " am"
    }
    else {
      return (time % 12) + " pm"
    }
  }

  formatDateClean(date: Date): string {
    const minutes = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
    return new Intl.DateTimeFormat('en', { month: 'short' }).format(date) 
      + " " + date.getDate()
      + ", " + date.getFullYear()
      + " " + date.getHours() + ":"
      + minutes;
  }

  formatDateShort(date: Date): string {
    return new Intl.DateTimeFormat('en', { month: 'short' }).format(date) 
      + " " + date.getDate();
  }

  formatDateYear(date: Date): string {
    return new Intl.DateTimeFormat('en', { month: 'short' }).format(date) 
      + " " + date.getFullYear();
  }

  timeClick(time: string): void {
    this.selectedTime = time;
    this.updateGraphs();
  }
}
