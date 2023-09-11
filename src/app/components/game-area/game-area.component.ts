import { Component, OnInit, OnDestroy, ElementRef } from "@angular/core";
import Phaser from "phaser";
@Component({
  selector: "app-game-area",
  template: "",
  styleUrls: ["./game-area.component.scss"],
})
export class GameAreaComponent implements OnInit, OnDestroy {
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  game!: Phaser.Game;
  gameConfig: Phaser.Types.Core.GameConfig;
  private avatar!: Phaser.GameObjects.Image;
  private cake!: Phaser.GameObjects.Image;
  private funSucker!: Phaser.GameObjects.Image;
  constructor(private elementRef: ElementRef) {
    this.gameConfig = {
      type: Phaser.AUTO,
      width: 1400,
      height: 600,
      canvasStyle: 'display:flex;margin: auto',
      backgroundColor: "#ffffff",
      parent: this.elementRef.nativeElement,
      physics: {
        default: "arcade",
        arcade: {
          debug: false, // set to true if you want to visually see the physics bodies
        },
      },

      scene: [GameScene, this.avatar, this.cake, this.funSucker], // add the scene here
    };
  }
  update() {
    const speed = 5;

    if (this.cursors.left.isDown) {
      this.avatar.x -= speed;
    } else if (this.cursors.right.isDown) {
      this.avatar.x += speed;
    }

    if (this.cursors.up.isDown) {
      this.avatar.y -= speed;
    } else if (this.cursors.down.isDown) {
      this.avatar.y += speed;
    }
  }
  ngOnInit(): void {
    this.game = new Phaser.Game(this.gameConfig);
  }

  ngOnDestroy(): void {
    this.game.destroy(true);
  }
}

// ... [Your previous code]

class GameScene extends Phaser.Scene {
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private avatar!: Phaser.Physics.Arcade.Image; // changed to arcade image for physics
  private cake!: Phaser.Physics.Arcade.Image; // changed to arcade image for physics
  private funSucker!: Phaser.Physics.Arcade.Image;
  private lives: number = 3;
  private livesText!: Phaser.GameObjects.Text;
  private cakeCollisionCount: number = 0; // counter to keep track of cake collisions
  private scoreText!: Phaser.GameObjects.Text;
  private fireballs!: Phaser.Physics.Arcade.Group;
  private spaceKey!: Phaser.Input.Keyboard.Key;
  private score: number = 0;
  private warningText!: Phaser.GameObjects.Text
  constructor() {
    super({ key: "GameScene" });
  }

  preload() {
    this.load.on("complete", () => {
 
      let hey = this.sound.add('hey');
      hey.detune = 300;
      hey.setVolume(2)
      hey.rate = .8
      hey.key 
      hey.play();
      let sound = this.sound.add('celebrate');
      sound.setVolume(1.3)
      sound.loop = true
      sound.play();
    });
    this.load.audio('celebrate', 'assets/celebrate.mp3');
    this.load.audio('touch', 'assets/touch.mp3');
    this.load.audio('hey', 'assets/hey.mp3');
    this.load.audio('fireFX', 'assets/fireFX.mp3');
    this.load.audio('handsOFF', 'assets/handsoff.mp3');
    this.load.audio('ouch', 'assets/ouch.mp3');
    this.load.audio('loveit', 'assets/loveit.mp3');
    this.load.audio('fireFX', 'assets/fireFX.mp3');
    this.load.image("killer", "assets/killer_gurl.png");
    this.load.image("killer_wow", "assets/killer_gurl_wow.png");
    this.load.image("fun_sucker", "assets/fun_sucker.png");
    this.load.image("cake", "assets/cake.png");
    this.load.image("fireball", "assets/fireball.png");

  }

  create() {
    this.add.image(400, 300, 'sky');
    // this.livesText = this.add.text(10, 40, "Lives: " + this.lives, { fontSize: '32px', color: '#000' });
    this.cake = this.physics.add
      .image(800, 350, "cake")
      .setDisplaySize(60, 50);
    this.avatar = this.physics.add
      .image(400, 300, "killer")
      .setDisplaySize(80, 140);
    this.cursors = this.input.keyboard?.createCursorKeys()!;
    this.scoreText = this.add.text(10, 10, "Score: 0", {
      fontSize: "32px",
      color: "#000",
    });
    // this.livesText.setText("Lives: " + this.lives);

    this.fireballs = this.physics.add.group();

    // Add space key event listener
    this.spaceKey = this.input.keyboard?.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    )!;

    // Check for collision between fireball and funSucker
    this.physics.add.collider(
      this.fireballs,
      this.funSucker,
      (fireball, funSucker) =>
        this.hitFunSucker(
          fireball as Phaser.Physics.Arcade.Image,
          funSucker as Phaser.Physics.Arcade.Image
        ),
      undefined,
      this
    );

    // Create the funSucker with physics and place it randomly on screen.
    // Full bounce on both x and y axes
    if (this.cakeCollisionCount == 5) {
      // Set the velocity
      const randomX = Math.random() * 1300;
      const randomY = Math.random() * 600;
      this.funSucker = this.physics.add
        .image(randomX, randomY, "fun_sucker")
        .setDisplaySize(120, 140);
      // Set up the collider here:

      // Set world bounds collision for funSucker
      (this.funSucker.body as Phaser.Physics.Arcade.Body).setCollideWorldBounds(
        true
      );

      // Make it bounce when hitting world bounds
      (this.funSucker.body as Phaser.Physics.Arcade.Body).setBounce(1, 1); // Full bounce on both x and y axes

      // Set the velocity
      const randomVelocityX = Math.random() * 200 - 100; // Random between -100 and 100
      const randomVelocityY = Math.random() * 200 - 100;
      (this.funSucker.body as Phaser.Physics.Arcade.Body).setVelocity(
        randomVelocityX,
        randomVelocityY
      );
    }
  }
  shootFireball() {

    let sound = this.sound.add('fireFX');
    sound.play();
    sound.detune = 90
    // Change the avatar's texture
    this.avatar.setTexture("killer_wow");
    this.physics.add.collider(
      this.fireballs,
      this.funSucker,
      (fireball, funSucker) =>
        this.hitFunSucker(
          fireball as Phaser.Physics.Arcade.Image,
          funSucker as Phaser.Physics.Arcade.Image
        ),
      undefined,
      this
    );
    // Create a fireball sprite at the position of the avatar
    const fireball = this.fireballs.create(
      this.avatar.x,
      this.avatar.y,
      "fireball"
    );

    // Set the size (if necessary)
    fireball.setDisplaySize(40, 40); // Adjust as needed

    // Check if the avatar is flipped (facing left)
    if (this.avatar.flipX) {
      // Shoot to the left
      fireball.setVelocityX(-300);
    } else {
      // Shoot to the right
      fireball.setVelocityX(300);
    }

    // Optionally, set a lifespan for the fireball so it disappears after a certain time
    fireball.lifespan = 2000; // For example, 2 seconds

    // Use a delayed call to revert the avatar's texture after 500 milliseconds
    this.time.delayedCall(
      500,
      () => {
        this.avatar.setTexture("killer");
      },
      [],
      this
    );
  }
  private collectCake(avatar: any, cake: any): boolean {
    return cake


this.newCake.destroy()



  }
newCake: any
  private generateCake(): void {
    // You can adjust the x and y coordinates for cake generation based on your game's logic.
    const x = Phaser.Math.Between(0, this.sys.canvas.width);
    const y = Phaser.Math.Between(0, this.sys.canvas.height);
    console.log("HELLo", this.avatar.x);

    // Assuming you have a method to create a cake or you can use inline logic
    this.newCake = this.add.sprite(x, y, 'cake').setDisplaySize(60, 60); // Replace 'cake' with your cake sprite key

    // Make sure you set up collisions or overlaps for this new cake just like you did for the initial ones
    this.physics.add.collider(this.avatar, this.newCake,this.collectCake, undefined, this);

  
  }
  hitFunSucker(
    fireball: Phaser.Physics.Arcade.Image,
    funSucker: Phaser.Physics.Arcade.Image
  ) {
    // Destroy the funSucker and the fireball upon collision
    this.warningText.destroy()
    this.warningText = this.add.text(20, 60, "OH FUCK YEA", {
      color: "black",
      fontSize: "23px"
    })
    let ouch = this.sound.add('ouch');
    ouch.play();
    ouch.detune = 90;
    ouch.rate = .8
    ouch.setVolume(3)
    funSucker.destroy();
    fireball.destroy();
  }
  spawnCakes(count: number) {
    const randomX = Math.random() * 1000;
    const randomY = Math.random() * 700;
    for (let i = 0; i < count; i++) {
      this.cake = this.physics.add
        .image(randomX, randomY, "cake")
        .setDisplaySize(60, 60);
        this.cake.setCollideWorldBounds(true)
      if (
        Phaser.Geom.Intersects.RectangleToRectangle(
          this.avatar.getBounds(),
          this.cake.getBounds()
        )
      ) {
        this.cake.destroy()
      }
    }
  }
  override update() {
    let speed = 5;
    this.cake.getBounds()
    if (this.cursors.left.isDown) {
      this.avatar.x -= speed;
      this.avatar.setFlipX(true); // Flip the sprite to face left
    } else if (this.cursors.right.isDown) {
      this.avatar.x += speed;
      this.avatar.setFlipX(false); // Reset the sprite to face right
    }

    if (this.cursors.up.isDown) {
      this.avatar.y -= speed;
    } else if (this.cursors.down.isDown) {
      this.avatar.y += speed;
    }

    if (
      Phaser.Geom.Intersects.RectangleToRectangle(
        this.avatar.getBounds(),
        this.cake.getBounds()
      )
    ) {
      this.score++;
      this.scoreText.setText("Score: " + this.score);
    
        this.cake.destroy()
      if (this.score < 5) {
        let sound = this.sound.add('handsOFF');
        sound.play();
        sound.detune = 300;
        sound.setVolume(1.4)

      }

      if (this.score >= 5) {
        let sound = this.sound.add('loveit');
        sound.play();
        sound.detune = 300;
        sound.setVolume(1.4)

      }
      this.cakeCollisionCount++; // increment the collision count
      // If cake collided into 5 times, show the fun_sucker image
      if (this.cakeCollisionCount == 5) {

        const randomX = Math.random() * 1300;
        const randomY = Math.random() * 700;
        const randomVelocityX = Math.random() * 200 - 100; // Random between -100 and 100
        const randomVelocityY = Math.random() * 200 - 100;
        let touchSound = this.sound.add('touch');
        touchSound.play();
        touchSound.detune = 100
        touchSound.detune = 80
        touchSound.setVolume(2)


        this.funSucker = this.physics.add
          .image(randomX, randomY, "fun_sucker")
          .setDisplaySize(120, 140);
        (
          this.funSucker.body as Phaser.Physics.Arcade.Body
        ).setCollideWorldBounds(true);
        (this.funSucker.body as Phaser.Physics.Arcade.Body).setVelocity(
          randomVelocityX,
          randomVelocityY
        );

        // Make it bounce when hitting world bounds
        (this.funSucker.body as Phaser.Physics.Arcade.Body).setBounce(1, 1);
        // Make fun_sucker move around the screen using velocity
      } else {
        // Otherwise, spawn the cake again at a random position
        const randomX = Math.random() * 1000;
        const randomY = Math.random() * 700;
        this.spawnCakes(1)

      }
      if (this.score == 10) {
        const randomX = Math.random() * 1000;
        const randomY = Math.random() * 700;
        const randomVelocityX = Math.random() * 200 - 100; // Random between -100 and 100
        const randomVelocityY = Math.random() * 200 - 100;
        let sound = this.sound.add('touch');
        sound.play();
        sound.detune = 90
        sound.setVolume(2.7)
        let funSucker = this.physics.add
          .image(randomX, randomY, "fun_sucker")
          .setDisplaySize(120, 140);
        (
          funSucker.body as Phaser.Physics.Arcade.Body
        ).setCollideWorldBounds(true);
        (funSucker.body as Phaser.Physics.Arcade.Body).setVelocity(
          randomVelocityX,
          randomVelocityY
        );
        (funSucker.body as Phaser.Physics.Arcade.Body).setBounce(1, 1);
        this.physics.add.collider(
          this.fireballs,
          funSucker,
          (fireball, funSucker) =>
            this.hitFunSucker(
              fireball as Phaser.Physics.Arcade.Image,
              funSucker as Phaser.Physics.Arcade.Image
            ),
          undefined,
          this
        );
      }
      if (this.score == 2) {
        this.warningText = this.add.text(10, 60, "OH NO, ITS A FUN SUCKER! HIT HIM WITH YOUR SUPER HOT FIREBALLS", {
          color: "black",
          fontSize: "20px"
        })
        const randomX = Math.random() * 1000;
        const randomY = Math.random() * 700;
        const randomVelocityX = Math.random() * 200 - 100; // Random between -100 and 100
        const randomVelocityY = Math.random() * 200 - 100;
        let sound = this.sound.add('touch');
        sound.detune = 100
        sound.setVolume(2)
        sound.play();
        let funSucker = this.physics.add
          .image(randomX, randomY, "fun_sucker")
          .setDisplaySize(120, 140);
        (
          funSucker.body as Phaser.Physics.Arcade.Body
        ).setCollideWorldBounds(true);
        (funSucker.body as Phaser.Physics.Arcade.Body).setVelocity(
          randomVelocityX,
          randomVelocityY
        );
        (funSucker.body as Phaser.Physics.Arcade.Body).setBounce(1, 1);
        this.physics.add.collider(
          this.fireballs,
          funSucker,
          (fireball, funSucker) =>
            this.hitFunSucker(
              fireball as Phaser.Physics.Arcade.Image,
              funSucker as Phaser.Physics.Arcade.Image
            ),
          undefined,
          this
        );
      }
      if (this.score == 9 || this.score == 15) {
        this.warningText = this.add.text(10, 60, "OH NO, ITS A FUN SUCKER! HIT HIM WITH YOUR SUPER HOT FIREBALLS", {
          color: "black",
          fontSize: "20px"
        })
        const randomX = Math.random() * 1000;
        const randomY = Math.random() * 700;
        const randomVelocityX = Math.random() * 200 - 100; // Random between -100 and 100
        const randomVelocityY = Math.random() * 200 - 100;
        let sound = this.sound.add('touch');
        sound.play();
        this.funSucker = this.physics.add
          .image(randomX, randomY, "fun_sucker")
          .setDisplaySize(120, 140);
    
        (
          this.funSucker.body as Phaser.Physics.Arcade.Body
        ).setCollideWorldBounds(true);
        ( this.funSucker.body as Phaser.Physics.Arcade.Body).setVelocity(
          randomVelocityX,
          randomVelocityY
        );
        ( this.funSucker.body as Phaser.Physics.Arcade.Body).setBounce(1, 1);
        this.physics.add.collider(
          this.fireballs,
          this.funSucker,
          (fireball, funSucker) =>
            this.hitFunSucker(
              fireball as Phaser.Physics.Arcade.Image,
              funSucker as Phaser.Physics.Arcade.Image
            ),
          undefined,
          this
        );
      }
    }

    if (Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
      this.shootFireball();
    }
    if (
      this.funSucker &&
      Phaser.Geom.Intersects.RectangleToRectangle(
        this.avatar.getBounds(),
        this.funSucker.getBounds()
      )
    ) {

this.score = 0

      this.avatar.setTexture("killer_wow");
      this.time.delayedCall(
        400,
        () => {
          this.avatar.setTexture("killer");
        },
        [],
        this
      );
    }
  }
  private gameOver() {
    // For now, let's just restart the scene. You can later extend this to show a game-over screen or more.
    this.scene.restart();
  }
}
