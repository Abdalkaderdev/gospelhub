export const crossReferences: { [key: string]: string[] } = {
  "Genesis:1:1": ["John:1:1", "Hebrews:11:3", "Psalms:33:6"],
  "Genesis:1:27": ["Matthew:19:4", "Mark:10:6", "1 Corinthians:11:7"],
  "John:1:1": ["Genesis:1:1", "1 John:1:1", "Revelation:19:13"],
  "John:3:16": ["Romans:5:8", "1 John:4:9", "Ephesians:2:4"],
  "Psalms:23:1": ["John:10:11", "Hebrews:13:20", "1 Peter:2:25"],
  "Romans:8:28": ["Ephesians:1:11", "Romans:8:29", "Jeremiah:29:11"],
  "Matthew:28:19": ["Acts:2:38", "2 Corinthians:13:14", "1 John:5:7"]
};

export const characters: { [book: string]: { name: string; role: string; description?: string; verses: string[] }[] } = {
  "Genesis": [
    { name: "Adam", role: "First Man", description: "The first human created by God in His image", verses: ["1:27", "2:7", "3:19"] },
    { name: "Eve", role: "First Woman", description: "The first woman, created as Adam's helper", verses: ["2:22", "3:20", "4:1"] },
    { name: "Noah", role: "Righteous Man", description: "Saved humanity through the ark during the flood", verses: ["6:9", "7:1", "8:20"] },
    { name: "Abraham", role: "Father of Faith", description: "Called by God to be the father of many nations", verses: ["12:1", "15:6", "22:2"] },
    { name: "Isaac", role: "Son of Promise", description: "Abraham's promised son through Sarah", verses: ["21:3", "22:9", "26:3"] },
    { name: "Jacob", role: "Israel", description: "Wrestled with God and became father of 12 tribes", verses: ["25:26", "32:28", "35:10"] },
    { name: "Joseph", role: "Dreamer", description: "Sold into slavery but became ruler of Egypt", verses: ["37:5", "41:40", "50:20"] }
  ],
  "Exodus": [
    { name: "Moses", role: "Deliverer", description: "Led Israel out of Egypt and received the Law", verses: ["2:10", "3:10", "20:1"] },
    { name: "Aaron", role: "High Priest", description: "Moses' brother and first high priest of Israel", verses: ["4:14", "28:1", "32:1"] },
    { name: "Pharaoh", role: "Oppressor", description: "Egyptian king who enslaved the Israelites", verses: ["1:8", "5:2", "14:8"] }
  ],
  "Numbers": [
    { name: "Moses", role: "Leader", description: "Guided Israel through 40 years in the wilderness", verses: ["12:3", "20:12", "27:12"] },
    { name: "Aaron", role: "High Priest", description: "Died on Mount Hor after 40 years of service", verses: ["20:24", "20:28"] },
    { name: "Joshua", role: "Successor", description: "Chosen to lead Israel into the Promised Land", verses: ["13:16", "27:18", "34:9"] }
  ],
  "Joshua": [
    { name: "Joshua", role: "Commander", description: "Led the conquest of the Promised Land", verses: ["1:1", "6:2", "24:29"] },
    { name: "Caleb", role: "Faithful Spy", description: "One of two faithful spies who trusted God", verses: ["14:6", "14:13", "15:13"] },
    { name: "Rahab", role: "Believer", description: "Canaanite woman who helped the spies", verses: ["2:1", "6:17", "6:25"] }
  ],
  "Judges": [
    { name: "Deborah", role: "Judge/Prophetess", description: "Led Israel to victory over the Canaanites", verses: ["4:4", "4:14", "5:1"] },
    { name: "Gideon", role: "Judge", description: "Defeated the Midianites with 300 men", verses: ["6:11", "7:7", "8:28"] },
    { name: "Samson", role: "Judge", description: "Strongest man who fought the Philistines", verses: ["13:24", "16:17", "16:30"] }
  ],
  "Ruth": [
    { name: "Ruth", role: "Loyal Daughter", description: "Moabite woman who showed loyalty to Naomi", verses: ["1:16", "2:2", "4:13"] },
    { name: "Naomi", role: "Mother-in-law", description: "Israelite woman who returned from Moab", verses: ["1:3", "1:20", "4:17"] },
    { name: "Boaz", role: "Kinsman Redeemer", description: "Wealthy man who married Ruth", verses: ["2:1", "3:12", "4:9"] }
  ],
  "1 Samuel": [
    { name: "Samuel", role: "Prophet/Judge", description: "Last judge and first prophet of Israel", verses: ["1:20", "3:10", "16:13"] },
    { name: "Saul", role: "First King", description: "Israel's first king, chosen by the people", verses: ["9:2", "10:24", "31:4"] },
    { name: "David", role: "Shepherd King", description: "Anointed as future king while still young", verses: ["16:11", "17:45", "24:6"] }
  ],
  "2 Samuel": [
    { name: "David", role: "King of Israel", description: "United the kingdom and established Jerusalem", verses: ["2:4", "7:16", "11:1"] },
    { name: "Bathsheba", role: "Queen", description: "Woman David sinned with, later his wife", verses: ["11:3", "12:24"] },
    { name: "Nathan", role: "Prophet", description: "Confronted David about his sin", verses: ["7:2", "12:1", "12:13"] }
  ],
  "1 Kings": [
    { name: "Solomon", role: "Wise King", description: "David's son known for wisdom and the temple", verses: ["1:39", "3:12", "11:4"] },
    { name: "Elijah", role: "Prophet", description: "Powerful prophet who confronted Ahab", verses: ["17:1", "18:36", "19:4"] },
    { name: "Ahab", role: "Wicked King", description: "King of Israel who worshiped Baal", verses: ["16:30", "21:25", "22:37"] }
  ],
  "Job": [
    { name: "Job", role: "Righteous Sufferer", description: "Blameless man tested through great suffering", verses: ["1:1", "1:21", "42:10"] },
    { name: "Satan", role: "Accuser", description: "Challenged Job's faithfulness to God", verses: ["1:6", "2:4", "2:7"] },
    { name: "Eliphaz", role: "Friend", description: "One of Job's three friends who gave counsel", verses: ["2:11", "4:1", "42:7"] }
  ],
  "Psalms": [
    { name: "David", role: "King/Psalmist", description: "Wrote many psalms expressing worship and lament", verses: ["23:1", "51:1", "139:1"] },
    { name: "Asaph", role: "Worship Leader", description: "Levite who led worship and wrote psalms", verses: ["50:1", "73:1", "83:1"] },
    { name: "Sons of Korah", role: "Temple Musicians", description: "Levitical family who served in temple worship", verses: ["42:1", "44:1", "49:1"] }
  ],
  "Proverbs": [
    { name: "Solomon", role: "Wise King", description: "Primary author of Proverbs, known for wisdom", verses: ["1:1", "10:1", "25:1"] },
    { name: "Agur", role: "Wise Man", description: "Author of Proverbs 30", verses: ["30:1"] },
    { name: "King Lemuel", role: "King", description: "Received wisdom from his mother (Proverbs 31)", verses: ["31:1"] }
  ],
  "Isaiah": [
    { name: "Isaiah", role: "Prophet", description: "Major prophet who prophesied about the Messiah", verses: ["1:1", "6:8", "53:3"] },
    { name: "Hezekiah", role: "King", description: "Righteous king of Judah during Isaiah's time", verses: ["36:1", "38:1", "39:1"] }
  ],
  "Jeremiah": [
    { name: "Jeremiah", role: "Weeping Prophet", description: "Prophet who warned of Jerusalem's destruction", verses: ["1:1", "1:5", "20:9"] },
    { name: "Baruch", role: "Scribe", description: "Jeremiah's faithful secretary and companion", verses: ["32:12", "36:4", "45:1"] }
  ],
  "Ezekiel": [
    { name: "Ezekiel", role: "Prophet", description: "Priest and prophet during the Babylonian exile", verses: ["1:1", "2:1", "37:1"] }
  ],
  "Daniel": [
    { name: "Daniel", role: "Prophet", description: "Jewish exile who served in Babylon", verses: ["1:6", "2:19", "6:10"] },
    { name: "Shadrach", role: "Faithful Friend", description: "One of Daniel's three friends", verses: ["1:7", "3:12", "3:26"] },
    { name: "Meshach", role: "Faithful Friend", description: "One of Daniel's three friends", verses: ["1:7", "3:12", "3:26"] },
    { name: "Abednego", role: "Faithful Friend", description: "One of Daniel's three friends", verses: ["1:7", "3:12", "3:26"] },
    { name: "Nebuchadnezzar", role: "Babylonian King", description: "Powerful king who conquered Jerusalem", verses: ["1:1", "2:1", "4:28"] }
  ],
  "Matthew": [
    { name: "Jesus", role: "Messiah", description: "The promised Messiah and King of the Jews", verses: ["1:1", "16:16", "28:18"] },
    { name: "Mary", role: "Mother of Jesus", description: "Virgin who gave birth to Jesus", verses: ["1:16", "1:20", "2:11"] },
    { name: "Joseph", role: "Earthly Father", description: "Righteous man who married Mary", verses: ["1:16", "1:19", "2:13"] },
    { name: "John the Baptist", role: "Forerunner", description: "Prepared the way for Jesus' ministry", verses: ["3:1", "11:11", "14:10"] }
  ],
  "Mark": [
    { name: "Jesus", role: "Servant", description: "The suffering servant who came to serve", verses: ["1:1", "10:45", "15:39"] },
    { name: "Peter", role: "Disciple", description: "Impulsive disciple who became a leader", verses: ["1:16", "8:29", "14:66"] },
    { name: "John the Baptist", role: "Forerunner", description: "Baptized Jesus and prepared His way", verses: ["1:4", "1:9", "6:14"] }
  ],
  "Luke": [
    { name: "Jesus", role: "Son of Man", description: "Perfect human who came to seek and save the lost", verses: ["1:35", "19:10", "23:46"] },
    { name: "Mary", role: "Mother of Jesus", description: "Humble servant who said 'yes' to God", verses: ["1:26", "1:38", "2:19"] },
    { name: "Elizabeth", role: "Mother of John", description: "Mary's relative, mother of John the Baptist", verses: ["1:5", "1:41", "1:57"] },
    { name: "Zechariah", role: "Priest", description: "John the Baptist's father, struck mute", verses: ["1:5", "1:20", "1:64"] }
  ],
  "John": [
    { name: "Jesus", role: "Son of God", description: "The Word made flesh, full of grace and truth", verses: ["1:1", "3:16", "20:31"] },
    { name: "John the Baptist", role: "Witness", description: "Testified that Jesus is the Lamb of God", verses: ["1:6", "1:29", "3:30"] },
    { name: "Nicodemus", role: "Pharisee", description: "Religious leader who came to Jesus by night", verses: ["3:1", "7:50", "19:39"] },
    { name: "Mary Magdalene", role: "Follower", description: "First to see the risen Jesus", verses: ["20:1", "20:11", "20:18"] },
    { name: "Thomas", role: "Doubting Disciple", description: "Disciple who doubted until he saw Jesus", verses: ["11:16", "20:24", "20:28"] }
  ],
  "Acts": [
    { name: "Peter", role: "Apostle", description: "Leader of the early church in Jerusalem", verses: ["1:15", "2:14", "10:34"] },
    { name: "Paul", role: "Apostle to Gentiles", description: "Missionary who spread the gospel to the world", verses: ["9:1", "13:9", "28:31"] },
    { name: "Stephen", role: "First Martyr", description: "First Christian to die for his faith", verses: ["6:5", "7:55", "7:60"] },
    { name: "Barnabas", role: "Encourager", description: "Paul's missionary companion", verses: ["4:36", "11:22", "13:2"] }
  ],
  "Romans": [
    { name: "Paul", role: "Apostle", description: "Author explaining the gospel to Roman Christians", verses: ["1:1", "1:16", "15:15"] }
  ],
  "1 Corinthians": [
    { name: "Paul", role: "Apostle", description: "Addressed problems in the Corinthian church", verses: ["1:1", "4:15", "16:21"] },
    { name: "Apollos", role: "Teacher", description: "Eloquent preacher who ministered in Corinth", verses: ["1:12", "3:4", "16:12"] }
  ],
  "Galatians": [
    { name: "Paul", role: "Apostle", description: "Defended justification by faith against legalism", verses: ["1:1", "2:20", "6:11"] }
  ],
  "Ephesians": [
    { name: "Paul", role: "Prisoner", description: "Wrote about the church while in prison", verses: ["1:1", "3:1", "6:20"] }
  ],
  "Philippians": [
    { name: "Paul", role: "Prisoner", description: "Expressed joy despite being in chains", verses: ["1:1", "1:13", "4:22"] },
    { name: "Timothy", role: "Co-worker", description: "Paul's faithful ministry partner", verses: ["1:1", "2:19", "2:22"] }
  ],
  "Colossians": [
    { name: "Paul", role: "Apostle", description: "Combated false teaching about Christ", verses: ["1:1", "1:23", "4:18"] },
    { name: "Epaphras", role: "Pastor", description: "Faithful minister who founded the church", verses: ["1:7", "4:12"] }
  ],
  "1 Thessalonians": [
    { name: "Paul", role: "Missionary", description: "Encouraged new believers in their faith", verses: ["1:1", "2:18", "5:27"] },
    { name: "Silas", role: "Co-worker", description: "Paul's missionary companion", verses: ["1:1"] },
    { name: "Timothy", role: "Co-worker", description: "Sent to encourage the Thessalonians", verses: ["1:1", "3:2", "3:6"] }
  ],
  "2 Thessalonians": [
    { name: "Paul", role: "Apostle", description: "Corrected misunderstandings about Christ's return", verses: ["1:1", "3:17"] }
  ],
  "1 Timothy": [
    { name: "Paul", role: "Mentor", description: "Instructed Timothy in church leadership", verses: ["1:1", "1:18", "6:20"] },
    { name: "Timothy", role: "Pastor", description: "Young pastor in Ephesus", verses: ["1:2", "4:12", "6:11"] }
  ],
  "2 Timothy": [
    { name: "Paul", role: "Prisoner", description: "Wrote his final letter before execution", verses: ["1:1", "1:8", "4:6"] },
    { name: "Timothy", role: "Faithful Son", description: "Paul's beloved spiritual son", verses: ["1:2", "2:1", "4:9"] }
  ],
  "Titus": [
    { name: "Paul", role: "Apostle", description: "Gave instructions for church organization", verses: ["1:1", "1:4", "3:15"] },
    { name: "Titus", role: "Church Organizer", description: "Left in Crete to organize the churches", verses: ["1:4", "1:5"] }
  ],
  "Philemon": [
    { name: "Paul", role: "Prisoner", description: "Appealed for forgiveness of a runaway slave", verses: ["1:1", "1:9", "1:19"] },
    { name: "Philemon", role: "Slave Owner", description: "Christian who owned the slave Onesimus", verses: ["1:1", "1:17"] },
    { name: "Onesimus", role: "Runaway Slave", description: "Became a Christian and returned to his master", verses: ["1:10", "1:16"] }
  ],
  "Hebrews": [
    { name: "Jesus", role: "High Priest", description: "Superior to all Old Testament priests", verses: ["1:3", "4:14", "7:26"] }
  ],
  "James": [
    { name: "James", role: "Church Leader", description: "Brother of Jesus who led the Jerusalem church", verses: ["1:1"] }
  ],
  "1 Peter": [
    { name: "Peter", role: "Apostle", description: "Encouraged suffering Christians", verses: ["1:1", "5:1", "5:12"] },
    { name: "Silas", role: "Secretary", description: "Helped Peter write the letter", verses: ["5:12"] }
  ],
  "2 Peter": [
    { name: "Peter", role: "Apostle", description: "Warned against false teachers", verses: ["1:1", "1:14", "3:1"] }
  ],
  "1 John": [
    { name: "John", role: "Apostle of Love", description: "Emphasized love and assurance of salvation", verses: ["1:1", "4:7", "5:13"] }
  ],
  "2 John": [
    { name: "John", role: "The Elder", description: "Warned against false teachers", verses: ["1:1", "1:7"] }
  ],
  "3 John": [
    { name: "John", role: "The Elder", description: "Commended hospitality and truth", verses: ["1:1"] },
    { name: "Gaius", role: "Faithful Christian", description: "Commended for his hospitality", verses: ["1:1", "1:5"] },
    { name: "Diotrephes", role: "Prideful Leader", description: "Church leader who rejected John's authority", verses: ["1:9"] }
  ],
  "Jude": [
    { name: "Jude", role: "Brother of James", description: "Warned against false teachers", verses: ["1:1", "1:3"] }
  ],
  "Revelation": [
    { name: "John", role: "Seer", description: "Received visions of the end times", verses: ["1:1", "1:9", "22:8"] },
    { name: "Jesus", role: "Lamb of God", description: "The victorious Lamb who conquers all", verses: ["1:5", "5:6", "19:16"] }
  ]
};

export const themes: { [book: string]: { theme: string; color: string; verses: string[] }[] } = {
  "Genesis": [
    { theme: "Creation", color: "#10b981", verses: ["1:1", "1:27", "2:7"] },
    { theme: "Fall of Man", color: "#ef4444", verses: ["3:6", "3:15", "3:24"] },
    { theme: "Covenant", color: "#3b82f6", verses: ["9:9", "15:18", "17:7"] }
  ],
  "John": [
    { theme: "Eternal Life", color: "#10b981", verses: ["3:16", "5:24", "17:3"] },
    { theme: "Light vs Darkness", color: "#f59e0b", verses: ["1:5", "8:12", "12:35"] },
    { theme: "Love", color: "#ec4899", verses: ["3:16", "13:34", "15:13"] }
  ],
  "Psalms": [
    { theme: "Trust in God", color: "#3b82f6", verses: ["23:1", "37:5", "56:3"] },
    { theme: "Praise & Worship", color: "#8b5cf6", verses: ["100:1", "150:1", "95:1"] }
  ]
};