import { Component, OnInit, signal, ChangeDetectorRef, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarComponent } from "@schedule-x/angular";
import { createCalendar, createViewWeek } from "@schedule-x/calendar";
import '@schedule-x/theme-default/dist/index.css' // can alternatively be added in your angular.json
import 'temporal-polyfill/global';

import { UtilsService } from '../../../services/utils.service';

const eventExample1 = {
  id: 'event-1',
  title: 'Event 1',
  calendarId: 'event-id',
  start: Temporal.Now.zonedDateTimeISO(),
  end: Temporal.Now.zonedDateTimeISO().add({ hours: 1 })
};

const eventExample2 = {
  id: 'event-2',
  title: 'Event 2',
  calendarId: 'event-id',
  start: Temporal.Now.zonedDateTimeISO(),
  end: Temporal.Now.zonedDateTimeISO().add({ hours: 1 })
};

const configCalendar: any = signal({
  events: [eventExample1],
  views: [createViewWeek()],
});

@Component({
  standalone: true,
  selector: 'app-template1',
  templateUrl: './template1.component.html',
  styleUrl: './template1.component.scss',
  imports: [
    CommonModule,
    CalendarComponent
  ]
})
export class Template1Component implements OnInit {
  protected readonly idCalendar = 'template1-calendar';

  show: boolean = true;

  calendarApp = createCalendar(configCalendar());

  keys = {
    Shift: false,
  };

  constructor(
    private cd: ChangeDetectorRef,
    private utilsService: UtilsService
  ) {
    effect(() => {
      const config = configCalendar();
      this.glowUpEvents(config);
      this.update(config);
    })
    setTimeout(() => {
      configCalendar.set(
        {
          ...configCalendar(),
          events: [eventExample2]
        }
      );
    }, 5000);
  }

  ngOnInit() {

  }

  update(configCalendar: any) {
    this.show = false;

    this.calendarApp = createCalendar(configCalendar);
    const calendar = document.getElementById(this.idCalendar);
    calendar && this.calendarApp.render(calendar);

    this.show = true;
    this.cd.detectChanges();
  }

  glowUpEvents(configCalendar: any) {
    configCalendar.events.forEach((event: any) => {
      this.glowUpEvent(event.id);
    });
  }

  glowUpEvent(eventId: string) {
    this.utilsService.waitForElm(`[data-event-id="${eventId}"]`).then((element: any) => {
      element.id = element.dataset.eventId;
      element.classList.add("custom-event-tag");
      const elementInner = element.querySelector(".sx__time-grid-event-inner");
      if (!elementInner) return;
      this.utilsService.dragElement({ element, elementInner, dragHorizontal: false });
    });
  }
}
