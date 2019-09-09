import {
  Component,
  Input
} from '@angular/core'

@Component({
  selector: 'denied-view',
  templateUrl: 'denied.view.html'
})
export class DeniedView {
  @Input() message: string;
}
