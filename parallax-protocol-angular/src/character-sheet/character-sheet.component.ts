import { Component } from '@angular/core';
import { EpithetComponent } from './epithet/epithet.component';

@Component({
  selector: 'app-character-sheet',
  imports: [EpithetComponent],
  templateUrl: './character-sheet.component.html',
  styleUrl: './character-sheet.component.scss'
})
export class CharacterSheetComponent {

}
