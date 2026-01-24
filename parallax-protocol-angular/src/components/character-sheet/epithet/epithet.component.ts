import { Component, Signal } from '@angular/core';
import { FormControl } from '@angular/forms';


@Component({
  selector: 'app-epithet',
  imports: [],
  templateUrl: './epithet.component.html',
  styleUrl: './epithet.component.scss'
})
export class EpithetComponent {
  nameControl = new FormControl('');
  // nameSignal: Signal<any>;

}
