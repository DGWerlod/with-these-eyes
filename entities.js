//ENTITIES SETUP
class Entity {
    constructor(x,y,w,h,sprite) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.sprite = new Image();
        this.sprite.src = sprite;
    }
    draw() {
        ctx.drawImage(this.sprite,this.x - (player.x + (player.w / 2)) + ctx.canvas.width / 2,this.y - (player.y + (player.h / 2)) + ctx.canvas.height / 2,this.w,this.h);
    }
    update() {
        this.draw();
    }
}

//ENEMY SETUP
class Enemy extends Entity {
    constructor(x,y,w,h,spritenorm,spriteanim,spdX,spdY,hp,atk,dmg,xp,bullet_type) {
        super(x,y,w,h);
        this.spritenorm = new Image();
        this.spriteanim = new Image();
        this.spritenorm.src = spritenorm;
        this.spriteanim.src = spriteanim;
        this.track = "norm";
        this.animcount = 15;
        this.spdX = spdX;
        this.spdY = spdY;
        this.hp = hp;
        this.atk = atk; //contact
        this.dmg = dmg; //bullet
        this.actcount = 80;
        this.aimangle = 0;
        this.xp = xp;
        this.bullet_type = bullet_type;
        this.removeMark = false;
    }
    doAttackCheck() {
        if (this.actcount <= 0 && writing === false && this.bullet_type) {
            this.actcount = 80;
            var dy = (player.y + (player.h/2))-(this.y + (this.h/2));
            var dx = (player.x + (player.w/2))-(this.x + (this.w/2));
            this.aimangle = Math.atan2(dy,dx);
            enemyBullets.push(new Bullet(this,10,10,"enmy",60,6,this.dmg)); //60f = 1.5 sec
        }
        this.actcount--;
    }
    anim_check() {
        if (this.animcount <= 0) {
            if (this.track === "norm") {
                this.track = "anim";
            } else {
               this.track = "norm";
            }
            this.animcount = 15;
        }
        this.animcount--;
        
    }
    updatePos() {
        if (this.x <= 0 || this.x >= curroom.map.w - this.w) {
            this.spdX = -this.spdX;
            this.spdY = -this.spdY;
        }
        this.x += this.spdX;
        this.y += this.spdY;
    }
    draw() {
        if (this.track === "norm") {
            ctx.drawImage(this.spritenorm,this.x - (player.x + (player.w / 2)) + ctx.canvas.width / 2,this.y - (player.y + (player.h / 2)) + ctx.canvas.height / 2,this.w,this.h);
        } else {
            ctx.drawImage(this.spriteanim,this.x - (player.x + (player.w / 2)) + ctx.canvas.width / 2,this.y - (player.y + (player.h / 2)) + ctx.canvas.height / 2,this.w,this.h);
        }
    }
    update() {
        if (this.hp <= 0) {
            this.removeMark = true;
        }
        this.doAttackCheck();
        this.anim_check();
        this.updatePos();
        this.draw();
    }
}

//CHARACTER SETUP
class Character extends Entity {
    constructor(x,y,w,h,passable,spriteleft,spriteright,spritespeak,spd,spriteleft_anim,spriteright_anim) {
        super(x,y,w,h);
        this.passable = passable;
        this.movedir = "";
        this.movecount = 0;
        this.afteraction = "";
        this.face = 0; //0-l, 1-r
        this.spd = spd;
        this.norm = [new Image(), new Image()];
        this.anim = [new Image(), new Image()];
        this.track = "norm";
        this.norm[0].src = spriteleft;
        this.norm[1].src = spriteright;
        this.anim[0].src = spriteleft_anim;
        this.anim[1].src = spriteright_anim;
        /*this.spriteleft = new Image();
        this.spriteleft.src = spriteleft;
        this.spriteright = new Image();
        this.spriteright.src = spriteright;
        this.spriteleft_anim = new Image();
        this.spriteleft_anim.src = spriteright;
        this.spriteright_anim = new Image();
        this.spriteright_anim.src = spriteright;*/
        this.spritespeak = new Image();
        this.spritespeak.src = spritespeak;
        this.animcount = 15;
    }
    anim_check() {
        if (this.animcount <= 0) {
            if (this.track === "norm") {
                this.track = "anim";
            } else {
               this.track = "norm";
            }
            this.animcount = 15;
        }
        this.animcount--;
        
    }
    updatePos() {
        if (this.movecount > 0) {
            if (this.movedir === "up") {
                this.y -= this.spd;
            } else if (this.movedir === "down") {
                this.y += this.spd;
            } else if (this.movedir === "left") {
                this.x -= this.spd;
                this.face = 0;
            } else if (this.movedir === "right") {
                this.x += this.spd;
                this.face = 1;
            }
            this.movecount --;
        } else if (this.afteraction != "") {
            resolveAction(this);
        }
        
    }
    draw() {
        if (this.track === "norm") {
            if (this.face === 0) {
                ctx.drawImage(this.norm[0],this.x - (player.x + (player.w / 2)) + ctx.canvas.width / 2,this.y - (player.y + (player.h / 2)) + ctx.canvas.height / 2,this.w,this.h);
            } else if (this.face === 1) {
                ctx.drawImage(this.norm[1],this.x - (player.x + (player.w / 2)) + ctx.canvas.width / 2,this.y - (player.y + (player.h / 2)) + ctx.canvas.height / 2,this.w,this.h);
            }
        } else {
            if (this.face === 0) {
                ctx.drawImage(this.anim[0],this.x - (player.x + (player.w / 2)) + ctx.canvas.width / 2,this.y - (player.y + (player.h / 2)) + ctx.canvas.height / 2,this.w,this.h);
            } else if (this.face === 1) {
                ctx.drawImage(this.anim[1],this.x - (player.x + (player.w / 2)) + ctx.canvas.width / 2,this.y - (player.y + (player.h / 2)) + ctx.canvas.height / 2,this.w,this.h);
            }
        }
        
    }
    update() {
        this.anim_check();
        this.updatePos();
        this.draw();
    }
}

//PLAYER SETUP
class Player extends Character {
    constructor(x,y,w,h,passable,spriteleft,spriteright,spritespeak,spd,spriteleft_anim,spriteright_anim) {
        super(x,y,w,h,passable,spriteleft,spriteright,spritespeak,spd,spriteleft_anim,spriteright_anim);
        this.hp = 50;
        this.power = 100;
        this.xp = 0; //levelup = 100xp * curlevel
        this.gold = 0;
        this.lv = 1;
        this.aimangle = 0;
        this.dmg = 1;
        this.bulletcatch = 0;
        this.bulletmax = 2;
    }
    doAttack() {
        if (this.bulletcatch <= 0 && playerBullets.length < this.bulletmax) {
            this.bulletcatch = 15;
            playerBullets.push(new Bullet(this,10,10,"plyr",60,6,this.dmg)); //60f = 1.5 sec
        }
    }
    testmobility() {
        var canMove = true;
        for (var f in curroom.fixed_areas) {
            if (testcollisionrect(this,curroom.fixed_areas[f])) {
                canMove = false;
            }
        }
        for (var g in curroom.enemies) {
            if (curroom.enemies[g].spdX === 0 && curroom.enemies[g].spdY === 0) {
                var dummy = {
                    x: curroom.enemies[g].x+5,
                    y: curroom.enemies[g].y+5,
                    w: curroom.enemies[g].w-5,
                    h: curroom.enemies[g].h-5,
                }
                if (testcollisionrect(this,dummy)) {
                    canMove = false;
                }
            }
        }
        for (var c in characters) {
            if (testcollisionrect(this,characters[c]) && characters[c].passable === false) {
                canMove = false;
            }
        }
        return canMove;
    }
    updatePos() {
        if (wpress && this.y >= this.spd) {
            this.y -= this.spd;
            if (this.testmobility() === false) {
                this.y += this.spd;
            }
        }
        if (apress && this.x >= this.spd) {
            this.x -= this.spd;
            if (this.testmobility() === false) {
                this.x += this.spd;
            }
        }
        if (spress && this.y <= curroom.map.h-this.spd-player.h) {
            this.y += this.spd;
            if (this.testmobility() === false) {
                this.y -= this.spd;
            }
        }
        if (dpress && this.x <= curroom.map.w-this.spd-player.w) {
            this.x += this.spd;
            if (this.testmobility() === false) {
                this.x -= this.spd;
            }
        }
    }
    draw() {
        if (this.track === "norm") {
            if (lastpress === "a") {
                ctx.drawImage(this.norm[0],ctx.canvas.width / 2 - player.w / 2, ctx.canvas.height / 2 - player.h / 2, player.w, player.h);
            } else if (lastpress === "d") {
                ctx.drawImage(this.norm[1],ctx.canvas.width / 2 - player.w / 2, ctx.canvas.height / 2 - player.h / 2, player.w, player.h);
            }
        } else {
            if (lastpress === "a") {
                ctx.drawImage(this.anim[0],ctx.canvas.width / 2 - player.w / 2, ctx.canvas.height / 2 - player.h / 2, player.w, player.h);
            } else if (lastpress === "d") {
                ctx.drawImage(this.anim[1],ctx.canvas.width / 2 - player.w / 2, ctx.canvas.height / 2 - player.h / 2, player.w, player.h);
            }
        }
    }
    update() {
        if (this.xp >= this.lv*100) {
            this.xp -= this.lv*100;
            this.lv ++;
        }
        this.anim_check();
        if (writing === false) {
            this.updatePos();
        }
        this.draw();
        this.bulletcatch --;
    }
}

//ENTITY CREATION
var player = new Player(-500,-500,33,45,true,"img/sprites/boy_left.png","img/sprites/boy_right.png","img/sprites/boy_speak.png",5,"img/sprites/boy_left.png","img/sprites/boy_right.png");
var characters = {
    carpet: new Character(-500,-500,30,45,true,"img/sprites/carpet.png","img/sprites/carpet.png","",0,"img/sprites/carpet.png","img/sprites/carpet.png"),
    boyM: new Character(-500,-500,33,45,true,"img/sprites/boy_left.png","img/sprites/boy_right.png","img/sprites/boy_speak.png",5,"img/sprites/boy_left.png","img/sprites/boy_right.png"),
    girlE: new Character(-500,-500,33,45,true,"img/sprites/girl_left.png","img/sprites/girl_right.png","img/sprites/girl_speak.png",5,"img/sprites/girl_left.png","img/sprites/girl_right.png"),
    door: new Character(-500,-500,40,80,false,"img/sprites/door_action.png","img/sprites/door_action.png","img/sprites/door_speak.png",0,"img/sprites/door_action.png","img/sprites/door_action.png"),
    snowman: new Character(-500,-500,27.5,45,false,"img/sprites/snowman_good_1.png","img/sprites/snowman_good_1.png","img/sprites/snowman_speak.PNG",0,"img/sprites/snowman_good_2.png","img/sprites/snowman_good_2.png"),
    snowmanmad: new Character(-500,-500,27.5,45,false,"img/sprites/snowman_good_1.png","img/sprites/snowman_good_1.png","img/sprites/snowmanmad_speak.PNG",0,"img/sprites/snowman_good_2.png","img/sprites/snowman_good_2.png"),
    tree: new Character(-500,-500,36,48,false,"img/sprites/tree_1.png","img/sprites/tree_1.png","img/sprites/tree_1.png",0,"img/sprites/tree_2.png","img/sprites/tree_2.png"),
    christmastree: new Character(-500,-500,30,45,false,"img/sprites/christmas_tree.png","img/sprites/christmas_tree.png","img/sprites/christmas_tree.png",0,"img/sprites/christmas_tree.png","img/sprites/christmas_tree.png"),
    deer: new Character(-500,-500,50,50,false,"img/sprites/deer_2.PNG","img/sprites/deer_2.PNG","img/sprites/deer_speak.png",0,"img/sprites/deer_3.PNG","img/sprites/deer_3.PNG"),
    deercry: new Character(-500,-500,50,50,false,"img/sprites/deer_2.PNG","img/sprites/deer_2.PNG","img/sprites/deer_speak.png",0,"img/sprites/deer_1.PNG","img/sprites/deer_1.PNG"),
    deermad: new Character(-500,-500,50,50,false,"img/sprites/deer_2.PNG","img/sprites/deer_2.PNG","img/sprites/evildeer_speak.png",0,"img/sprites/deer_2.PNG","img/sprites/deer_2.PNG"),
    gnomered: new Character(-500,-500,33,45,false,"img/sprites/gnomered_1.PNG","img/sprites/gnomered_1.PNG","img/sprites/gnomered_speak.png",0,"img/sprites/gnomered_2.PNG","img/sprites/gnomered_2.PNG"),
    gnomeblue: new Character(-500,-500,33,45,false,"img/sprites/gnomeblue_1.PNG","img/sprites/gnomeblue_1.PNG","img/sprites/gnomeblue_speak.png",0,"img/sprites/gnomeblue_2.PNG","img/sprites/gnomeblue_2.PNG"),
    gnomeredmad: new Character(-500,-500,33,45,false,"img/sprites/gnomered_1.PNG","img/sprites/gnomered_1.PNG","img/sprites/gnomered_speak_mad.png",0,"img/sprites/gnomered_2.PNG","img/sprites/gnomered_2.PNG"),
    gnomebluemad: new Character(-500,-500,33,45,false,"img/sprites/gnomeblue_1.PNG","img/sprites/gnomeblue_1.PNG","img/sprites/gnomeblue_speak_mad.png",0,"img/sprites/gnomeblue_2.PNG","img/sprites/gnomeblue_2.PNG"),
    lumberjack: new Character(-500,-500,33,45,"img/sprites/lumberjack.PNG","img/sprites/lumberjack.PNG","img/sprites/lumberjack_speak.PNG",0,"img/sprites/lumberjack.PNG","img/sprites/lumberjack.PNG"),
    banker: new Character(-500,-500,33,45,"img/sprites/banker.PNG","img/sprites/banker.PNG","img/sprites/banker_speak.PNG",0,"img/sprites/banker.PNG","img/sprites/banker.PNG"),
};
var wasd = {};