import { Component, Signal } from '@angular/core';
// import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {form, FormField, required, email} from '@angular/forms/signals';


@Component({
  selector: 'app-epithet',
  imports: [FormField],
  templateUrl: './epithet.component.html',
  styleUrl: './epithet.component.scss'
})
export class EpithetComponent {
  // nameControl = new FormControl('');
  // nameSignal: Signal<any>;

}
