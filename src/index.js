// src/index.js
import Phaser from 'phaser';

class MainScene extends Phaser.Scene {
  constructor() {
    super('MainScene');
  }

  preload() {
    // Загрузка ассетов
    this.load.image('floor', 'assets/floor.png'); // Пол
    this.load.image('wall', 'assets/wall.png'); // Стены
    this.load.image('desk', 'assets/desk.png'); // Стол
    this.load.image('chair', 'assets/chair.png'); // Стул
    this.load.image('player', 'assets/player.png'); // Актер/игрок
    this.load.image('door', 'assets/door.png');
    this.load.image('floor1', 'assets/floor1.png'); // Новый ассет для коридора
  }

  create() {
    // Создаем план этажа
    this.createFloorPlan();

    // Создаем игрока
    this.player = this.physics.add.sprite(20, 125, 'player')
        .setScale(0.8)
        .setSize(25, 40)       // Adjust these numbers to make hitbox smaller
        .setOffset(12.50, 5);    // Adjust these numbers to center the hitbox

    this.player.setCollideWorldBounds(true);

    // Настраиваем управление
    this.cursors = this.input.keyboard.createCursorKeys();

    // Добавляем интерактивность
    this.createInteractivity();

    // Создаем текстовое поле для ID кабинета в голубой области
    this.roomIdText = this.add.text(630, 50, 'Room ID: None', {
      fontSize: '14px',
      fill: '#ffffff',
      fontFamily: 'Arial',
      wordWrap: { width: 160 },
    });
    this.roomIdText.setScrollFactor(0);

    // Создаем область для чата
    this.createChatArea();
  }

  update() {
    // Управление игроком
    const speed = 200;
    this.player.setVelocity(0);

    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-speed);
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(speed);
    }

    if (this.cursors.up.isDown) {
      this.player.setVelocityY(-speed);
    } else if (this.cursors.down.isDown) {
      this.player.setVelocityY(speed);
    }

    // Проверяем столкновения
    this.physics.world.collide(this.player, this.walls);
  }

  createFloorPlan() {
    this.rooms = [];
    this.walls = this.physics.add.staticGroup();

    // Размеры комнат
    const roomWidth = 150;
    const roomHeight = 100;
    const corridorWidth = 50;

    // Верхние комнаты
    for (let i = 0; i < 4; i++) {
      const x = 75 + i * 153;
      const y = 50;

      // Комната
      this.add.rectangle(x, y, roomWidth, roomHeight, 0xaaaaaa);

      // Объекты комнаты
      this.add.image(x, y - 10, 'desk').setScale(1);
      this.add.image(x, y + 10, 'chair').setScale(0.6);

      // Стены между комнатами
      if (i > 0) {
        this.walls.create(x - roomWidth / 2.9 - corridorWidth / 2, y, 'wall')
            .setScale(0.1, 2.1)
            .setSize(20, 100)  // Set actual collision box size in pixels
            .setOffset(40, 0)  // Adjust offset to center the collision box
            .refreshBody();
      }

      // Дверь к коридору (размещаем поверх стен)
      this.add.image(x, y + roomHeight / 1.75 - 5, 'door').setScale(1.3);

      this.rooms.push({ id: `Room-${i + 1}`, x, y });
    }

    // Нижние комнаты
    for (let i = 0; i < 4; i++) {
      const x = 75 + i * 153;
      const y = 200;

      // Комната
      this.add.rectangle(x, y, roomWidth, roomHeight, 0xaaaaaa);

      // Объекты комнаты
      this.add.image(x, y - -10, 'desk').setScale(1).setAngle(180);
      this.add.image(x, y + -10, 'chair').setScale(0.6).setAngle(180);

      // Стены между комнатами
      if (i > 0) {
        this.walls.create(x - roomWidth / 2.9 - corridorWidth / 2, y, 'wall')
            .setScale(0.1, 2.1)
            .setSize(20, 100)  // Set actual collision box size in pixels
            .setOffset(40, 0)  // Adjust offset to center the collision box
            .refreshBody();
      }

      // Дверь к коридору (размещаем поверх стен)
      this.add.image(x, y - roomHeight / 1.9 + 6, 'door').setScale(1.3);

      this.rooms.push({ id: `Room-${i + 5}`, x, y });
    }

    // Коридор
    this.add.tileSprite(300, 125, 620, 50, 'floor1');

    // Стены сверху и снизу коридора
    // Верхняя стена
    this.walls.create(10, 98, 'wall').setScale(1.85, 0.1).refreshBody();
    this.walls.create(150, 98, 'wall').setScale(2.37, 0.1).refreshBody();
    this.walls.create(304, 98, 'wall').setScale(2.37, 0.1).refreshBody();
    this.walls.create(457, 98, 'wall').setScale(2.37, 0.1).refreshBody();
    this.walls.create(580, 98, 'wall').setScale(1.20, 0.1).refreshBody();

    // Нижняя стена
    this.walls.create(10, 152, 'wall').setScale(1.85, 0.1).refreshBody();
    this.walls.create(150, 152, 'wall').setScale(2.37, 0.1).refreshBody();
    this.walls.create(304, 152, 'wall').setScale(2.37, 0.1).refreshBody();
    this.walls.create(457, 152, 'wall').setScale(2.37, 0.1).refreshBody();
    this.walls.create(580, 152, 'wall').setScale(1.20, 0.1).refreshBody();

    // Перемещаем разделительную стену ещё левее
    this.walls.create(780, 125, 'wall').setScale(0.1, 5).refreshBody();
  }

  createChatArea() {
    // Чёрный фон для чата
    const chatBackground = this.add.graphics();
    chatBackground.fillStyle(0x000000, 0.9);
    chatBackground.fillRect(840, 10, 130, 230);

    // Текстовое поле для сообщений
    this.chatText = this.add.text(800, 20, '', {
      fontSize: '12px',
      fill: '#ffffff',
      fontFamily: 'Arial',
      wordWrap: { width: 120 },
    });

    // Заглушка для новых сообщений
    this.newMessage('Chat initialized.');
  }

  newMessage(message) {
    this.chatText.setText(this.chatText.text + '\n' + message);
  }

  createInteractivity() {
    this.input.keyboard.on('keydown-ENTER', () => {
      this.rooms.forEach((room) => {
        const dist = Phaser.Math.Distance.Between(
            this.player.x,
            this.player.y,
            room.x,
            room.y
        );
        if (dist < 50) {
          // Обновляем текст ID кабинета в голубой области
          this.roomIdText.setText(`Room ID: ${room.id}`);
          // Добавляем сообщение в чат
          this.newMessage(`Entered ${room.id}`);
        }
      });
    });
  }
}

const config = {
  type: Phaser.AUTO,
  width: 1000, // Увеличиваем ширину экрана
  height: 250,
  physics: {
    default: 'arcade',
    arcade: {
      debug: false,
    },
  },
  scene: MainScene,
};

const game = new Phaser.Game(config);
