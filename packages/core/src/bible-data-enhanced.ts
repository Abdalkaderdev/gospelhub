import { Verse, BibleChapter, BibleBook } from './types';

// Enhanced sample data for Genesis 1-5 with realistic verse text
export const ENHANCED_BIBLE_DATA: BibleChapter[] = [
  {
    book: 'Genesis',
    chapter: 1,
    verses: [
      { book: 'Genesis', chapter: 1, verse: 1, text: 'In the beginning God created the heavens and the earth.', reference: 'Genesis 1:1' },
      { book: 'Genesis', chapter: 1, verse: 2, text: 'The earth was without form and void, and darkness was over the face of the deep. And the Spirit of God was hovering over the face of the waters.', reference: 'Genesis 1:2' },
      { book: 'Genesis', chapter: 1, verse: 3, text: 'And God said, "Let there be light," and there was light.', reference: 'Genesis 1:3' },
      { book: 'Genesis', chapter: 1, verse: 4, text: 'And God saw that the light was good. And God separated the light from the darkness.', reference: 'Genesis 1:4' },
      { book: 'Genesis', chapter: 1, verse: 5, text: 'God called the light Day, and the darkness he called Night. And there was evening and there was morning, the first day.', reference: 'Genesis 1:5' },
      { book: 'Genesis', chapter: 1, verse: 6, text: 'And God said, "Let there be an expanse in the midst of the waters, and let it separate the waters from the waters."', reference: 'Genesis 1:6' },
      { book: 'Genesis', chapter: 1, verse: 7, text: 'And God made the expanse and separated the waters that were under the expanse from the waters that were above the expanse. And it was so.', reference: 'Genesis 1:7' },
      { book: 'Genesis', chapter: 1, verse: 8, text: 'And God called the expanse Heaven. And there was evening and there was morning, the second day.', reference: 'Genesis 1:8' },
      { book: 'Genesis', chapter: 1, verse: 9, text: 'And God said, "Let the waters under the heavens be gathered together into one place, and let the dry land appear." And it was so.', reference: 'Genesis 1:9' },
      { book: 'Genesis', chapter: 1, verse: 10, text: 'God called the dry land Earth, and the waters that were gathered together he called Seas. And God saw that it was good.', reference: 'Genesis 1:10' },
      { book: 'Genesis', chapter: 1, verse: 11, text: 'And God said, "Let the earth sprout vegetation, plants yielding seed, and fruit trees bearing fruit in which is their seed, each according to its kind, on the earth." And it was so.', reference: 'Genesis 1:11' },
      { book: 'Genesis', chapter: 1, verse: 12, text: 'The earth brought forth vegetation, plants yielding seed according to their own kinds, and trees bearing fruit in which is their seed, each according to its kind. And God saw that it was good.', reference: 'Genesis 1:12' },
      { book: 'Genesis', chapter: 1, verse: 13, text: 'And there was evening and there was morning, the third day.', reference: 'Genesis 1:13' },
      { book: 'Genesis', chapter: 1, verse: 14, text: 'And God said, "Let there be lights in the expanse of the heavens to separate the day from the night. And let them be for signs and for seasons, and for days and years,', reference: 'Genesis 1:14' },
      { book: 'Genesis', chapter: 1, verse: 15, text: 'and let them be lights in the expanse of the heavens to give light upon the earth." And it was so.', reference: 'Genesis 1:15' },
      { book: 'Genesis', chapter: 1, verse: 16, text: 'And God made the two great lights—the greater light to rule the day and the lesser light to rule the night—and the stars.', reference: 'Genesis 1:16' },
      { book: 'Genesis', chapter: 1, verse: 17, text: 'And God set them in the expanse of the heavens to give light on the earth,', reference: 'Genesis 1:17' },
      { book: 'Genesis', chapter: 1, verse: 18, text: 'to rule over the day and over the night, and to separate the light from the darkness. And God saw that it was good.', reference: 'Genesis 1:18' },
      { book: 'Genesis', chapter: 1, verse: 19, text: 'And there was evening and there was morning, the fourth day.', reference: 'Genesis 1:19' },
      { book: 'Genesis', chapter: 1, verse: 20, text: 'And God said, "Let the waters swarm with swarms of living creatures, and let birds fly above the earth across the expanse of the heavens."', reference: 'Genesis 1:20' },
      { book: 'Genesis', chapter: 1, verse: 21, text: 'So God created the great sea creatures and every living creature that moves, with which the waters swarm, according to their kinds, and every winged bird according to its kind. And God saw that it was good.', reference: 'Genesis 1:21' },
      { book: 'Genesis', chapter: 1, verse: 22, text: 'And God blessed them, saying, "Be fruitful and multiply and fill the waters in the seas, and let birds multiply on the earth."', reference: 'Genesis 1:22' },
      { book: 'Genesis', chapter: 1, verse: 23, text: 'And there was evening and there was morning, the fifth day.', reference: 'Genesis 1:23' },
      { book: 'Genesis', chapter: 1, verse: 24, text: 'And God said, "Let the earth bring forth living creatures according to their kinds—livestock and creeping things and beasts of the earth according to their kinds." And it was so.', reference: 'Genesis 1:24' },
      { book: 'Genesis', chapter: 1, verse: 25, text: 'And God made the beasts of the earth according to their kinds and the livestock according to their kinds, and everything that creeps on the ground according to its kind. And God saw that it was good.', reference: 'Genesis 1:25' },
      { book: 'Genesis', chapter: 1, verse: 26, text: 'Then God said, "Let us make man in our image, after our likeness. And let them have dominion over the fish of the sea and over the birds of the heavens and over the livestock and over all the earth and over every creeping thing that creeps on the earth."', reference: 'Genesis 1:26' },
      { book: 'Genesis', chapter: 1, verse: 27, text: 'So God created man in his own image, in the image of God he created him; male and female he created them.', reference: 'Genesis 1:27' },
      { book: 'Genesis', chapter: 1, verse: 28, text: 'And God blessed them. And God said to them, "Be fruitful and multiply and fill the earth and subdue it, and have dominion over the fish of the sea and over the birds of the heavens and over every living thing that moves on the earth."', reference: 'Genesis 1:28' },
      { book: 'Genesis', chapter: 1, verse: 29, text: 'And God said, "Behold, I have given you every plant yielding seed that is on the face of all the earth, and every tree with seed in its fruit. You shall have them for food.', reference: 'Genesis 1:29' },
      { book: 'Genesis', chapter: 1, verse: 30, text: 'And to every beast of the earth and to every bird of the heavens and to everything that creeps on the earth, everything that has the breath of life, I have given every green plant for food." And it was so.', reference: 'Genesis 1:30' },
      { book: 'Genesis', chapter: 1, verse: 31, text: 'And God saw everything that he had made, and behold, it was very good. And there was evening and there was morning, the sixth day.', reference: 'Genesis 1:31' }
    ]
  },
  {
    book: 'Genesis',
    chapter: 2,
    verses: [
      { book: 'Genesis', chapter: 2, verse: 1, text: 'Thus the heavens and the earth were finished, and all the host of them.', reference: 'Genesis 2:1' },
      { book: 'Genesis', chapter: 2, verse: 2, text: 'And on the seventh day God finished his work that he had done, and he rested on the seventh day from all his work that he had done.', reference: 'Genesis 2:2' },
      { book: 'Genesis', chapter: 2, verse: 3, text: 'So God blessed the seventh day and made it holy, because on it God rested from all his work that he had done in creation.', reference: 'Genesis 2:3' },
      { book: 'Genesis', chapter: 2, verse: 4, text: 'These are the generations of the heavens and the earth when they were created, in the day that the Lord God made the earth and the heavens.', reference: 'Genesis 2:4' },
      { book: 'Genesis', chapter: 2, verse: 5, text: 'When no bush of the field was yet in the land and no small plant of the field had yet sprung up—for the Lord God had not caused it to rain on the land, and there was no man to work the ground,', reference: 'Genesis 2:5' },
      { book: 'Genesis', chapter: 2, verse: 6, text: 'and a mist was going up from the land and was watering the whole face of the ground—', reference: 'Genesis 2:6' },
      { book: 'Genesis', chapter: 2, verse: 7, text: 'then the Lord God formed the man of dust from the ground and breathed into his nostrils the breath of life, and the man became a living creature.', reference: 'Genesis 2:7' },
      { book: 'Genesis', chapter: 2, verse: 8, text: 'And the Lord God planted a garden in Eden, in the east, and there he put the man whom he had formed.', reference: 'Genesis 2:8' },
      { book: 'Genesis', chapter: 2, verse: 9, text: 'And out of the ground the Lord God made to spring up every tree that is pleasant to the sight and good for food. The tree of life was in the midst of the garden, and the tree of the knowledge of good and evil.', reference: 'Genesis 2:9' },
      { book: 'Genesis', chapter: 2, verse: 10, text: 'A river flowed out of Eden to water the garden, and there it divided and became four rivers.', reference: 'Genesis 2:10' },
      { book: 'Genesis', chapter: 2, verse: 11, text: 'The name of the first is the Pishon. It is the one that flowed around the whole land of Havilah, where there is gold.', reference: 'Genesis 2:11' },
      { book: 'Genesis', chapter: 2, verse: 12, text: 'And the gold of that land is good; bdellium and onyx stone are there.', reference: 'Genesis 2:12' },
      { book: 'Genesis', chapter: 2, verse: 13, text: 'The name of the second river is the Gihon. It is the one that flowed around the whole land of Cush.', reference: 'Genesis 2:13' },
      { book: 'Genesis', chapter: 2, verse: 14, text: 'And the name of the third river is the Tigris, which flows east of Assyria. And the fourth river is the Euphrates.', reference: 'Genesis 2:14' },
      { book: 'Genesis', chapter: 2, verse: 15, text: 'The Lord God took the man and put him in the garden of Eden to work it and keep it.', reference: 'Genesis 2:15' },
      { book: 'Genesis', chapter: 2, verse: 16, text: 'And the Lord God commanded the man, saying, "You may surely eat of every tree of the garden,', reference: 'Genesis 2:16' },
      { book: 'Genesis', chapter: 2, verse: 17, text: 'but of the tree of the knowledge of good and evil you shall not eat, for in the day that you eat of it you shall surely die."', reference: 'Genesis 2:17' },
      { book: 'Genesis', chapter: 2, verse: 18, text: 'Then the Lord God said, "It is not good that the man should be alone; I will make him a helper fit for him."', reference: 'Genesis 2:18' },
      { book: 'Genesis', chapter: 2, verse: 19, text: 'Now out of the ground the Lord God had formed every beast of the field and every bird of the heavens and brought them to the man to see what he would call them. And whatever the man called every living creature, that was its name.', reference: 'Genesis 2:19' },
      { book: 'Genesis', chapter: 2, verse: 20, text: 'The man gave names to all livestock and to the birds of the heavens and to every beast of the field. But for Adam there was not found a helper fit for him.', reference: 'Genesis 2:20' },
      { book: 'Genesis', chapter: 2, verse: 21, text: 'So the Lord God caused a deep sleep to fall upon the man, and while he slept he took one of his ribs and closed up its place with flesh.', reference: 'Genesis 2:21' },
      { book: 'Genesis', chapter: 2, verse: 22, text: 'And the rib that the Lord God had taken from the man he made into a woman and brought her to the man.', reference: 'Genesis 2:22' },
      { book: 'Genesis', chapter: 2, verse: 23, text: 'Then the man said, "This at last is bone of my bones and flesh of my flesh; she shall be called Woman, because she was taken out of Man."', reference: 'Genesis 2:23' },
      { book: 'Genesis', chapter: 2, verse: 24, text: 'Therefore a man shall leave his father and his mother and hold fast to his wife, and they shall become one flesh.', reference: 'Genesis 2:24' },
      { book: 'Genesis', chapter: 2, verse: 25, text: 'And the man and his wife were both naked and were not ashamed.', reference: 'Genesis 2:25' }
    ]
  },
  {
    book: 'Genesis',
    chapter: 3,
    verses: [
      { book: 'Genesis', chapter: 3, verse: 1, text: 'Now the serpent was more crafty than any other beast of the field that the Lord God had made. He said to the woman, "Did God actually say, \'You shall not eat of any tree in the garden\'?"', reference: 'Genesis 3:1' },
      { book: 'Genesis', chapter: 3, verse: 2, text: 'And the woman said to the serpent, "We may eat of the fruit of the trees in the garden,', reference: 'Genesis 3:2' },
      { book: 'Genesis', chapter: 3, verse: 3, text: 'but God said, \'You shall not eat of the fruit of the tree that is in the midst of the garden, neither shall you touch it, lest you die.\'"', reference: 'Genesis 3:3' },
      { book: 'Genesis', chapter: 3, verse: 4, text: 'But the serpent said to the woman, "You will not surely die.', reference: 'Genesis 3:4' },
      { book: 'Genesis', chapter: 3, verse: 5, text: 'For God knows that when you eat of it your eyes will be opened, and you will be like God, knowing good and evil."', reference: 'Genesis 3:5' },
      { book: 'Genesis', chapter: 3, verse: 6, text: 'So when the woman saw that the tree was good for food, and that it was a delight to the eyes, and that the tree was to be desired to make one wise, she took of its fruit and ate, and she also gave some to her husband who was with her, and he ate.', reference: 'Genesis 3:6' },
      { book: 'Genesis', chapter: 3, verse: 7, text: 'Then the eyes of both were opened, and they knew that they were naked. And they sewed fig leaves together and made themselves loincloths.', reference: 'Genesis 3:7' },
      { book: 'Genesis', chapter: 3, verse: 8, text: 'And they heard the sound of the Lord God walking in the garden in the cool of the day, and the man and his wife hid themselves from the presence of the Lord God among the trees of the garden.', reference: 'Genesis 3:8' },
      { book: 'Genesis', chapter: 3, verse: 9, text: 'But the Lord God called to the man and said to him, "Where are you?"', reference: 'Genesis 3:9' },
      { book: 'Genesis', chapter: 3, verse: 10, text: 'And he said, "I heard the sound of you in the garden, and I was afraid, because I was naked, and I hid myself."', reference: 'Genesis 3:10' },
      { book: 'Genesis', chapter: 3, verse: 11, text: 'He said, "Who told you that you were naked? Have you eaten of the tree of which I commanded you not to eat?"', reference: 'Genesis 3:11' },
      { book: 'Genesis', chapter: 3, verse: 12, text: 'The man said, "The woman whom you gave to be with me, she gave me fruit of the tree, and I ate."', reference: 'Genesis 3:12' },
      { book: 'Genesis', chapter: 3, verse: 13, text: 'Then the Lord God said to the woman, "What is this that you have done?" The woman said, "The serpent deceived me, and I ate."', reference: 'Genesis 3:13' },
      { book: 'Genesis', chapter: 3, verse: 14, text: 'The Lord God said to the serpent, "Because you have done this, cursed are you above all livestock and above all beasts of the field; on your belly you shall go, and dust you shall eat all the days of your life.', reference: 'Genesis 3:14' },
      { book: 'Genesis', chapter: 3, verse: 15, text: 'I will put enmity between you and the woman, and between your offspring and her offspring; he shall bruise your head, and you shall bruise his heel."', reference: 'Genesis 3:15' },
      { book: 'Genesis', chapter: 3, verse: 16, text: 'To the woman he said, "I will surely multiply your pain in childbearing; in pain you shall bring forth children. Your desire shall be for your husband, and he shall rule over you."', reference: 'Genesis 3:16' },
      { book: 'Genesis', chapter: 3, verse: 17, text: 'And to Adam he said, "Because you have listened to the voice of your wife and have eaten of the tree of which I commanded you, \'You shall not eat of it,\' cursed is the ground because of you; in pain you shall eat of it all the days of your life;', reference: 'Genesis 3:17' },
      { book: 'Genesis', chapter: 3, verse: 18, text: 'thorns and thistles it shall bring forth for you; and you shall eat the plants of the field.', reference: 'Genesis 3:18' },
      { book: 'Genesis', chapter: 3, verse: 19, text: 'By the sweat of your face you shall eat bread, till you return to the ground, for out of it you were taken; for you are dust, and to dust you shall return."', reference: 'Genesis 3:19' },
      { book: 'Genesis', chapter: 3, verse: 20, text: 'The man called his wife\'s name Eve, because she was the mother of all living.', reference: 'Genesis 3:20' },
      { book: 'Genesis', chapter: 3, verse: 21, text: 'And the Lord God made for Adam and for his wife garments of skins and clothed them.', reference: 'Genesis 3:21' },
      { book: 'Genesis', chapter: 3, verse: 22, text: 'Then the Lord God said, "Behold, the man has become like one of us in knowing good and evil. Now, lest he reach out his hand and take also of the tree of life and eat, and live forever—"', reference: 'Genesis 3:22' },
      { book: 'Genesis', chapter: 3, verse: 23, text: 'therefore the Lord God sent him out from the garden of Eden to work the ground from which he was taken.', reference: 'Genesis 3:23' },
      { book: 'Genesis', chapter: 3, verse: 24, text: 'He drove out the man, and at the east of the garden of Eden he placed the cherubim and a flaming sword that turned every way to guard the way to the tree of life.', reference: 'Genesis 3:24' }
    ]
  },
  {
    book: 'Genesis',
    chapter: 4,
    verses: [
      { book: 'Genesis', chapter: 4, verse: 1, text: 'Now Adam knew Eve his wife, and she conceived and bore Cain, saying, "I have gotten a man with the help of the Lord."', reference: 'Genesis 4:1' },
      { book: 'Genesis', chapter: 4, verse: 2, text: 'And again, she bore his brother Abel. Now Abel was a keeper of sheep, and Cain a worker of the ground.', reference: 'Genesis 4:2' },
      { book: 'Genesis', chapter: 4, verse: 3, text: 'In the course of time Cain brought to the Lord an offering of the fruit of the ground,', reference: 'Genesis 4:3' },
      { book: 'Genesis', chapter: 4, verse: 4, text: 'and Abel also brought of the firstborn of his flock and of their fat portions. And the Lord had regard for Abel and his offering,', reference: 'Genesis 4:4' },
      { book: 'Genesis', chapter: 4, verse: 5, text: 'but for Cain and his offering he had no regard. So Cain was very angry, and his face fell.', reference: 'Genesis 4:5' },
      { book: 'Genesis', chapter: 4, verse: 6, text: 'The Lord said to Cain, "Why are you angry, and why has your face fallen?', reference: 'Genesis 4:6' },
      { book: 'Genesis', chapter: 4, verse: 7, text: 'If you do well, will you not be accepted? And if you do not do well, sin is crouching at the door. Its desire is contrary to you, but you must rule over it."', reference: 'Genesis 4:7' },
      { book: 'Genesis', chapter: 4, verse: 8, text: 'Cain spoke to Abel his brother. And when they were in the field, Cain rose up against his brother Abel and killed him.', reference: 'Genesis 4:8' },
      { book: 'Genesis', chapter: 4, verse: 9, text: 'Then the Lord said to Cain, "Where is Abel your brother?" He said, "I do not know; am I my brother\'s keeper?"', reference: 'Genesis 4:9' },
      { book: 'Genesis', chapter: 4, verse: 10, text: 'And the Lord said, "What have you done? The voice of your brother\'s blood is crying to me from the ground.', reference: 'Genesis 4:10' },
      { book: 'Genesis', chapter: 4, verse: 11, text: 'And now you are cursed from the ground, which has opened its mouth to receive your brother\'s blood from your hand.', reference: 'Genesis 4:11' },
      { book: 'Genesis', chapter: 4, verse: 12, text: 'When you work the ground, it shall no longer yield to you its strength. You shall be a fugitive and a wanderer on the earth."', reference: 'Genesis 4:12' },
      { book: 'Genesis', chapter: 4, verse: 13, text: 'Cain said to the Lord, "My punishment is greater than I can bear.', reference: 'Genesis 4:13' },
      { book: 'Genesis', chapter: 4, verse: 14, text: 'Behold, you have driven me today away from the ground, and from your face I shall be hidden. I shall be a fugitive and a wanderer on the earth, and whoever finds me will kill me."', reference: 'Genesis 4:14' },
      { book: 'Genesis', chapter: 4, verse: 15, text: 'But the Lord said to him, "Not so! If anyone kills Cain, vengeance shall be taken on him sevenfold." And the Lord put a mark on Cain, lest any who found him should attack him.', reference: 'Genesis 4:15' },
      { book: 'Genesis', chapter: 4, verse: 16, text: 'Then Cain went away from the presence of the Lord and settled in the land of Nod, east of Eden.', reference: 'Genesis 4:16' },
      { book: 'Genesis', chapter: 4, verse: 17, text: 'Cain knew his wife, and she conceived and bore Enoch. When he built a city, he called the name of the city after the name of his son, Enoch.', reference: 'Genesis 4:17' },
      { book: 'Genesis', chapter: 4, verse: 18, text: 'To Enoch was born Irad, and Irad fathered Mehujael, and Mehujael fathered Methushael, and Methushael fathered Lamech.', reference: 'Genesis 4:18' },
      { book: 'Genesis', chapter: 4, verse: 19, text: 'And Lamech took two wives. The name of the one was Adah, and the name of the other was Zillah.', reference: 'Genesis 4:19' },
      { book: 'Genesis', chapter: 4, verse: 20, text: 'Adah bore Jabal; he was the father of those who dwell in tents and have livestock.', reference: 'Genesis 4:20' },
      { book: 'Genesis', chapter: 4, verse: 21, text: 'His brother\'s name was Jubal; he was the father of all those who play the lyre and pipe.', reference: 'Genesis 4:21' },
      { book: 'Genesis', chapter: 4, verse: 22, text: 'Zillah also bore Tubal-cain; he was the forger of all instruments of bronze and iron. Tubal-cain\'s sister was Naamah.', reference: 'Genesis 4:22' },
      { book: 'Genesis', chapter: 4, verse: 23, text: 'Lamech said to his wives: "Adah and Zillah, hear my voice; you wives of Lamech, listen to what I say: I have killed a man for wounding me, a young man for striking me.', reference: 'Genesis 4:23' },
      { book: 'Genesis', chapter: 4, verse: 24, text: 'If Cain\'s revenge is sevenfold, then Lamech\'s is seventy-sevenfold."', reference: 'Genesis 4:24' },
      { book: 'Genesis', chapter: 4, verse: 25, text: 'And Adam knew his wife again, and she bore a son and called his name Seth, for she said, "God has appointed for me another offspring instead of Abel, for Cain killed him."', reference: 'Genesis 4:25' },
      { book: 'Genesis', chapter: 4, verse: 26, text: 'To Seth also a son was born, and he called his name Enosh. At that time people began to call upon the name of the Lord.', reference: 'Genesis 4:26' }
    ]
  },
  {
    book: 'Genesis',
    chapter: 5,
    verses: [
      { book: 'Genesis', chapter: 5, verse: 1, text: 'This is the book of the generations of Adam. When God created man, he made him in the likeness of God.', reference: 'Genesis 5:1' },
      { book: 'Genesis', chapter: 5, verse: 2, text: 'Male and female he created them, and he blessed them and named them Man when they were created.', reference: 'Genesis 5:2' },
      { book: 'Genesis', chapter: 5, verse: 3, text: 'When Adam had lived 130 years, he fathered a son in his own likeness, after his image, and named him Seth.', reference: 'Genesis 5:3' },
      { book: 'Genesis', chapter: 5, verse: 4, text: 'The days of Adam after he fathered Seth were 800 years; and he had other sons and daughters.', reference: 'Genesis 5:4' },
      { book: 'Genesis', chapter: 5, verse: 5, text: 'Thus all the days that Adam lived were 930 years, and he died.', reference: 'Genesis 5:5' },
      { book: 'Genesis', chapter: 5, verse: 6, text: 'When Seth had lived 105 years, he fathered Enosh.', reference: 'Genesis 5:6' },
      { book: 'Genesis', chapter: 5, verse: 7, text: 'Seth lived after he fathered Enosh 807 years and had other sons and daughters.', reference: 'Genesis 5:7' },
      { book: 'Genesis', chapter: 5, verse: 8, text: 'Thus all the days of Seth were 912 years, and he died.', reference: 'Genesis 5:8' },
      { book: 'Genesis', chapter: 5, verse: 9, text: 'When Enosh had lived 90 years, he fathered Kenan.', reference: 'Genesis 5:9' },
      { book: 'Genesis', chapter: 5, verse: 10, text: 'Enosh lived after he fathered Kenan 815 years and had other sons and daughters.', reference: 'Genesis 5:10' },
      { book: 'Genesis', chapter: 5, verse: 11, text: 'Thus all the days of Enosh were 905 years, and he died.', reference: 'Genesis 5:11' },
      { book: 'Genesis', chapter: 5, verse: 12, text: 'When Kenan had lived 70 years, he fathered Mahalalel.', reference: 'Genesis 5:12' },
      { book: 'Genesis', chapter: 5, verse: 13, text: 'Kenan lived after he fathered Mahalalel 840 years and had other sons and daughters.', reference: 'Genesis 5:13' },
      { book: 'Genesis', chapter: 5, verse: 14, text: 'Thus all the days of Kenan were 910 years, and he died.', reference: 'Genesis 5:14' },
      { book: 'Genesis', chapter: 5, verse: 15, text: 'When Mahalalel had lived 65 years, he fathered Jared.', reference: 'Genesis 5:15' },
      { book: 'Genesis', chapter: 5, verse: 16, text: 'Mahalalel lived after he fathered Jared 830 years and had other sons and daughters.', reference: 'Genesis 5:16' },
      { book: 'Genesis', chapter: 5, verse: 17, text: 'Thus all the days of Mahalalel were 895 years, and he died.', reference: 'Genesis 5:17' },
      { book: 'Genesis', chapter: 5, verse: 18, text: 'When Jared had lived 162 years, he fathered Enoch.', reference: 'Genesis 5:18' },
      { book: 'Genesis', chapter: 5, verse: 19, text: 'Jared lived after he fathered Enoch 800 years and had other sons and daughters.', reference: 'Genesis 5:19' },
      { book: 'Genesis', chapter: 5, verse: 20, text: 'Thus all the days of Jared were 962 years, and he died.', reference: 'Genesis 5:20' },
      { book: 'Genesis', chapter: 5, verse: 21, text: 'When Enoch had lived 65 years, he fathered Methuselah.', reference: 'Genesis 5:21' },
      { book: 'Genesis', chapter: 5, verse: 22, text: 'Enoch walked with God after he fathered Methuselah 300 years and had other sons and daughters.', reference: 'Genesis 5:22' },
      { book: 'Genesis', chapter: 5, verse: 23, text: 'Thus all the days of Enoch were 365 years.', reference: 'Genesis 5:23' },
      { book: 'Genesis', chapter: 5, verse: 24, text: 'Enoch walked with God, and he was not, for God took him.', reference: 'Genesis 5:24' },
      { book: 'Genesis', chapter: 5, verse: 25, text: 'When Methuselah had lived 187 years, he fathered Lamech.', reference: 'Genesis 5:25' },
      { book: 'Genesis', chapter: 5, verse: 26, text: 'Methuselah lived after he fathered Lamech 782 years and had other sons and daughters.', reference: 'Genesis 5:27' },
      { book: 'Genesis', chapter: 5, verse: 27, text: 'Thus all the days of Methuselah were 969 years, and he died.', reference: 'Genesis 5:28' },
      { book: 'Genesis', chapter: 5, verse: 28, text: 'When Lamech had lived 182 years, he fathered a son', reference: 'Genesis 5:29' },
      { book: 'Genesis', chapter: 5, verse: 29, text: 'and called his name Noah, saying, "Out of the ground that the Lord has cursed this one shall bring us relief from our work and from the painful toil of our hands."', reference: 'Genesis 5:30' },
      { book: 'Genesis', chapter: 5, verse: 30, text: 'Lamech lived after he fathered Noah 595 years and had other sons and daughters.', reference: 'Genesis 5:31' },
      { book: 'Genesis', chapter: 5, verse: 31, text: 'Thus all the days of Lamech were 777 years, and he died.', reference: 'Genesis 5:32' },
      { book: 'Genesis', chapter: 5, verse: 32, text: 'After Noah was 500 years old, Noah fathered Shem, Ham, and Japheth.', reference: 'Genesis 5:32' }
    ]
  }
];

// Enhanced Bible data service
export class BibleDataService {
  private static instance: BibleDataService;
  private data: BibleChapter[] = ENHANCED_BIBLE_DATA;

  static getInstance(): BibleDataService {
    if (!BibleDataService.instance) {
      BibleDataService.instance = new BibleDataService();
    }
    return BibleDataService.instance;
  }

  getChapter(book: string, chapter: number): BibleChapter | null {
    return this.data.find(c => c.book === book && c.chapter === chapter) || null;
  }

  getAllVerses(): Verse[] {
    return this.data.flatMap(chapter => chapter.verses);
  }

  getVerses(book: string, chapter: number): Verse[] {
    const chapterData = this.getChapter(book, chapter);
    return chapterData ? chapterData.verses : [];
  }

  getBookMetadata(book: string): { totalChapters: number; totalVerses: number } | null {
    const chapters = this.data.filter(c => c.book === book);
    if (chapters.length === 0) return null;
    
    const totalChapters = chapters.length;
    const totalVerses = chapters.reduce((sum, chapter) => sum + chapter.verses.length, 0);
    
    return { totalChapters, totalVerses };
  }

  searchVerses(query: string, book?: string): Verse[] {
    const verses = book ? this.getVerses(book, 1) : this.getAllVerses();
    return verses.filter(verse => 
      verse.text.toLowerCase().includes(query.toLowerCase()) ||
      verse.reference.toLowerCase().includes(query.toLowerCase())
    );
  }

  getNextChapter(book: string, chapter: number): { book: string; chapter: number } | null {
    const currentChapter = this.getChapter(book, chapter);
    if (!currentChapter) return null;

    const nextChapter = this.getChapter(book, chapter + 1);
    if (nextChapter) {
      return { book, chapter: chapter + 1 };
    }

    // For now, return null if no next chapter
    // In a real app, this would load the next book
    return null;
  }

  getPreviousChapter(book: string, chapter: number): { book: string; chapter: number } | null {
    if (chapter > 1) {
      const prevChapter = this.getChapter(book, chapter - 1);
      if (prevChapter) {
        return { book, chapter: chapter - 1 };
      }
    }

    // For now, return null if no previous chapter
    // In a real app, this would load the previous book
    return null;
  }
}