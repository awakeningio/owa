/**
 *  @file       Level2ReadyAnimationController.js
 *
 *
 *  @author     Colin Sullivan <colin [at] colin-sullivan.net>
 *
 *  @copyright  2018 Colin Sullivan
 *  @license    Licensed under the GPLv3 license.
 **/


import LevelReadyAnimation from './LevelReadyAnimation';
import ControllerWithStore from './ControllerWithStore';
import { getLevel2Ready } from './selectors';

class Level2ReadyAnimationController extends ControllerWithStore {
  init () {
    this.level2Ready = getLevel2Ready(this.store.getState());

    this.animation = new LevelReadyAnimation(
      this.store,
      Object.assign({}, this.params, {
        levelId: 'level_2'
      })
    );
  }

  handle_state_change () {
    let level2Ready = getLevel2Ready(this.store.getState());

    if (level2Ready !== this.level2Ready) {
      if (level2Ready) {
        this.animation.start();
      } else {
        this.animation.stop();
      }
      this.level2Ready = level2Ready;
    }
  }
}

export default Level2ReadyAnimationController;
