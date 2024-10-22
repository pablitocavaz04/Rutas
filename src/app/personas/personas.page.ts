import { Component, ElementRef, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { NavController, AnimationController, InfiniteScrollCustomEvent } from '@ionic/angular';
import { Subscription, BehaviorSubject, Observable } from 'rxjs';
import { AuthService } from '../auth.service';
import { PeopleService } from '../core/services/impl/people.service';
import { Paginated } from '../core/models/paginated.model';
import { Person } from '../core/models/person.model';

@Component({
  selector: 'app-personas',
  templateUrl: './personas.page.html',
  styleUrls: ['./personas.page.scss'],
})
export class PersonasPage implements OnInit, OnDestroy {
  subscription: Subscription | undefined;
  _people: BehaviorSubject<Person[]> = new BehaviorSubject<Person[]>([]);
  people$: Observable<Person[]> = this._people.asObservable();
  selectedPerson: any = null;
  isAnimating = false;
  page: number = 1;
  pageSize: number = 25;

  @ViewChildren('avatar') avatars!: QueryList<ElementRef>;
  @ViewChild('animatedAvatar') animatedAvatar!: ElementRef;
  @ViewChild('animatedAvatarContainer') animatedAvatarContainer!: ElementRef;

  constructor(
    private navCtrl: NavController,
    private authService: AuthService,
    private animationCtrl: AnimationController,
    private peopleSv: PeopleService
  ) {
    this.subscription = this.authService.authenticated$.subscribe((value) => {
      if (!value) {
        this.navCtrl.navigateRoot('/home');
      }
    });
  }

  ngOnInit(): void {
    this.getMorePeople();
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  getMorePeople(notify: HTMLIonInfiniteScrollElement | null = null) {
    this.peopleSv.getAll(this.page, this.pageSize).subscribe({
      next: (response: Paginated<Person>) => {
        this._people.next([...this._people.value, ...response.data]);
        this.page++;
        notify?.complete();
      }
    });
  }

  async openPersonDetail(person: any, index: number) {
    this.selectedPerson = person;
    const avatarElements = this.avatars.toArray();
    const clickedAvatar = avatarElements[index].nativeElement;

    const avatarRect = clickedAvatar.getBoundingClientRect();

    this.isAnimating = true;

    const animatedAvatarElement = this.animatedAvatar.nativeElement as HTMLElement;
    animatedAvatarElement.style.position = 'absolute';
    animatedAvatarElement.style.top = `${avatarRect.top}px`;
    animatedAvatarElement.style.left = `${avatarRect.left}px`;
    animatedAvatarElement.style.width = `${avatarRect.width}px`;
    animatedAvatarElement.style.height = `${avatarRect.height}px`;

    const animation = this.animationCtrl.create()
      .addElement(animatedAvatarElement)
      .duration(500)
      .easing('ease-out')
      .fromTo('transform', 'translate(0, 0) scale(1)', `translate(${window.innerWidth / 2 - avatarRect.left - avatarRect.width / 2}px, ${window.innerHeight / 2 - avatarRect.top - avatarRect.height / 2}px) scale(5)`);

    await animation.play();
  }

  onIonInfinite(ev: InfiniteScrollCustomEvent) {
    this.getMorePeople(ev.target);
  }
}
