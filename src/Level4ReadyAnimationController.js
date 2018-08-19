/**
 *  @file       Level4ReadyAnimationController.js
 *
 *
 *  @author     Colin Sullivan <colin [at] colin-sullivan.net>
 *
 *  @copyright  2018 Colin Sullivan
 *  @license    Licensed under the GPLv3 license.
 **/

import LevelReadyAnimation from './LevelReadyAnimation';
import ControllerWithStore from './ControllerWithStore';
import { getLevel4Ready } from './selectors';

class Level4ReadyAnimationController extends ControllerWithStore {
  init () {
    this.level4Ready = getLevel4Ready(this.store.getState());
    this.animation = new LevelReadyAnimation(
      this.store,
      Object.assign({}, this.params, {
        levelId: 'level_4'
      })
    );
  }

  handle_state_change () {
    let level4Ready = getLevel4Ready(this.store.getState());

    if (level4Ready !== this.level4Ready) {
      if (level4Ready) {
        this.animation.start();
      } else {
        this.animation.stop();
      }
      this.level4Ready = level4Ready;
    }
  }
}

export default Level4ReadyAnimationController;
