export interface BookIntroduction {
  author: string;
  dateWritten: string;
  audience: string;
  purpose: string;
  keyThemes: string[];
  outline: { title: string; chapters: string }[];
  timeline: { event: string; date: string; reference?: string }[];
}

export const bookIntroductions: { [book: string]: BookIntroduction } = {
  // Old Testament - Law
  Genesis: {
    author: "Moses",
    dateWritten: "c. 1440-1400 BC",
    audience: "Israelites",
    purpose: "To record God's creation of the world and His covenant with the patriarchs",
    keyThemes: ["Creation", "Fall", "Covenant", "Promise", "Providence"],
    outline: [
      { title: "Creation and Fall", chapters: "1-11" },
      { title: "Abraham", chapters: "12-25" },
      { title: "Isaac and Jacob", chapters: "26-36" },
      { title: "Joseph", chapters: "37-50" }
    ],
    timeline: [
      { event: "Creation", date: "Beginning", reference: "Genesis 1:1" },
      { event: "Fall of Man", date: "Unknown", reference: "Genesis 3" },
      { event: "Noah's Flood", date: "c. 2348 BC", reference: "Genesis 6-9" },
      { event: "Call of Abraham", date: "c. 2091 BC", reference: "Genesis 12" }
    ]
  },
  Exodus: {
    author: "Moses",
    dateWritten: "c. 1440-1400 BC",
    audience: "Israelites",
    purpose: "To record Israel's deliverance from Egypt and the giving of the Law",
    keyThemes: ["Deliverance", "Covenant", "Law", "Worship", "God's Presence"],
    outline: [
      { title: "Slavery in Egypt", chapters: "1-11" },
      { title: "The Exodus", chapters: "12-18" },
      { title: "The Law at Sinai", chapters: "19-24" },
      { title: "The Tabernacle", chapters: "25-40" }
    ],
    timeline: [
      { event: "Moses' Birth", date: "c. 1526 BC", reference: "Exodus 2:1-10" },
      { event: "The Exodus", date: "c. 1446 BC", reference: "Exodus 12" },
      { event: "Red Sea Crossing", date: "c. 1446 BC", reference: "Exodus 14" },
      { event: "Ten Commandments", date: "c. 1446 BC", reference: "Exodus 20" }
    ]
  },
  Leviticus: {
    author: "Moses",
    dateWritten: "c. 1440-1400 BC",
    audience: "Israelites, especially the priests",
    purpose: "To provide instructions for worship and holy living",
    keyThemes: ["Holiness", "Sacrifice", "Priesthood", "Purity", "Atonement"],
    outline: [
      { title: "Laws of Sacrifice", chapters: "1-7" },
      { title: "Priesthood", chapters: "8-10" },
      { title: "Laws of Purity", chapters: "11-16" },
      { title: "Holiness Code", chapters: "17-27" }
    ],
    timeline: [
      { event: "Tabernacle Completed", date: "c. 1445 BC", reference: "Leviticus 8" },
      { event: "Day of Atonement", date: "Annual", reference: "Leviticus 16" }
    ]
  },
  Numbers: {
    author: "Moses",
    dateWritten: "c. 1440-1400 BC",
    audience: "Israelites",
    purpose: "To record Israel's wilderness wanderings and preparation for Canaan",
    keyThemes: ["Wilderness", "Rebellion", "Faithfulness", "Journey", "Promise"],
    outline: [
      { title: "Preparation at Sinai", chapters: "1-10" },
      { title: "Journey to Kadesh", chapters: "11-20" },
      { title: "Journey to Moab", chapters: "21-36" }
    ],
    timeline: [
      { event: "Census at Sinai", date: "c. 1445 BC", reference: "Numbers 1" },
      { event: "Spies Sent", date: "c. 1444 BC", reference: "Numbers 13" },
      { event: "40 Years Begin", date: "c. 1444 BC", reference: "Numbers 14" }
    ]
  },
  Deuteronomy: {
    author: "Moses",
    dateWritten: "c. 1406 BC",
    audience: "New generation of Israelites",
    purpose: "To renew the covenant and prepare Israel for the Promised Land",
    keyThemes: ["Covenant Renewal", "Obedience", "Love for God", "Blessing and Curse", "Leadership"],
    outline: [
      { title: "Historical Review", chapters: "1-4" },
      { title: "The Law Restated", chapters: "5-26" },
      { title: "Covenant Renewal", chapters: "27-30" },
      { title: "Moses' Final Words", chapters: "31-34" }
    ],
    timeline: [
      { event: "Moses' Speeches", date: "c. 1406 BC", reference: "Deuteronomy 1-30" },
      { event: "Moses' Death", date: "c. 1406 BC", reference: "Deuteronomy 34" }
    ]
  },

  // Old Testament - History
  Joshua: {
    author: "Joshua (and others)",
    dateWritten: "c. 1400-1370 BC",
    audience: "Israelites",
    purpose: "To record the conquest and settlement of the Promised Land",
    keyThemes: ["Conquest", "Faithfulness", "Inheritance", "Covenant", "Victory"],
    outline: [
      { title: "Conquest of Canaan", chapters: "1-12" },
      { title: "Division of the Land", chapters: "13-21" },
      { title: "Joshua's Farewell", chapters: "22-24" }
    ],
    timeline: [
      { event: "Crossing Jordan", date: "c. 1406 BC", reference: "Joshua 3-4" },
      { event: "Fall of Jericho", date: "c. 1406 BC", reference: "Joshua 6" },
      { event: "Joshua's Death", date: "c. 1375 BC", reference: "Joshua 24" }
    ]
  },
  Judges: {
    author: "Unknown (possibly Samuel)",
    dateWritten: "c. 1043-1004 BC",
    audience: "Israelites",
    purpose: "To show the consequences of disobedience and the need for godly leadership",
    keyThemes: ["Cycle of Sin", "Deliverance", "Leadership", "Apostasy", "Consequences"],
    outline: [
      { title: "Incomplete Conquest", chapters: "1-3" },
      { title: "The Judges", chapters: "4-16" },
      { title: "Moral Decline", chapters: "17-21" }
    ],
    timeline: [
      { event: "Period of Judges Begins", date: "c. 1375 BC", reference: "Judges 2" },
      { event: "Gideon", date: "c. 1162 BC", reference: "Judges 6-8" },
      { event: "Samson", date: "c. 1075 BC", reference: "Judges 13-16" }
    ]
  },
  Ruth: {
    author: "Unknown (possibly Samuel)",
    dateWritten: "c. 1030-1010 BC",
    audience: "Israelites",
    purpose: "To show God's providence and faithfulness through a Gentile woman",
    keyThemes: ["Loyalty", "Redemption", "Providence", "Faithfulness", "Inclusion"],
    outline: [
      { title: "Ruth's Decision", chapters: "1" },
      { title: "Ruth Meets Boaz", chapters: "2" },
      { title: "Ruth's Request", chapters: "3" },
      { title: "Ruth's Redemption", chapters: "4" }
    ],
    timeline: [
      { event: "Time of Judges", date: "c. 1100 BC", reference: "Ruth 1:1" },
      { event: "Ruth's Marriage", date: "c. 1100 BC", reference: "Ruth 4" }
    ]
  },
  "1 Samuel": {
    author: "Samuel, Nathan, Gad",
    dateWritten: "c. 930-722 BC",
    audience: "Israelites",
    purpose: "To record the transition from judges to monarchy in Israel",
    keyThemes: ["Leadership", "Obedience", "God's Choice", "Kingship", "Heart Attitude"],
    outline: [
      { title: "Samuel's Ministry", chapters: "1-7" },
      { title: "Saul's Reign", chapters: "8-15" },
      { title: "David's Rise", chapters: "16-31" }
    ],
    timeline: [
      { event: "Samuel's Birth", date: "c. 1105 BC", reference: "1 Samuel 1" },
      { event: "Saul Anointed", date: "c. 1050 BC", reference: "1 Samuel 10" },
      { event: "David Anointed", date: "c. 1025 BC", reference: "1 Samuel 16" }
    ]
  },
  "2 Samuel": {
    author: "Nathan, Gad, and others",
    dateWritten: "c. 930-722 BC",
    audience: "Israelites",
    purpose: "To record David's reign and God's covenant with him",
    keyThemes: ["Davidic Covenant", "Kingdom", "Sin and Consequences", "Repentance", "God's Mercy"],
    outline: [
      { title: "David's Triumphs", chapters: "1-10" },
      { title: "David's Troubles", chapters: "11-20" },
      { title: "David's Final Years", chapters: "21-24" }
    ],
    timeline: [
      { event: "David Becomes King", date: "c. 1010 BC", reference: "2 Samuel 2" },
      { event: "Davidic Covenant", date: "c. 1003 BC", reference: "2 Samuel 7" },
      { event: "David's Sin", date: "c. 995 BC", reference: "2 Samuel 11" }
    ]
  },

  // Old Testament - Poetry
  Job: {
    author: "Unknown (possibly Job, Moses, or Solomon)",
    dateWritten: "Unknown (possibly 2000-1800 BC)",
    audience: "All who suffer",
    purpose: "To address the problem of suffering and God's sovereignty",
    keyThemes: ["Suffering", "Faith", "God's Sovereignty", "Wisdom", "Perseverance"],
    outline: [
      { title: "Job's Trial", chapters: "1-2" },
      { title: "Job's Dialogue", chapters: "3-37" },
      { title: "God's Response", chapters: "38-41" },
      { title: "Job's Restoration", chapters: "42" }
    ],
    timeline: [
      { event: "Job's Testing", date: "Unknown", reference: "Job 1-2" },
      { event: "Job's Restoration", date: "Unknown", reference: "Job 42" }
    ]
  },
  Psalms: {
    author: "David, Asaph, Sons of Korah, and others",
    dateWritten: "c. 1440-586 BC",
    audience: "Israel and all believers",
    purpose: "To provide songs for worship and express the full range of human emotion before God",
    keyThemes: ["Worship", "Trust", "Lament", "Praise", "God's Faithfulness"],
    outline: [
      { title: "Book I", chapters: "1-41" },
      { title: "Book II", chapters: "42-72" },
      { title: "Book III", chapters: "73-89" },
      { title: "Book IV", chapters: "90-106" },
      { title: "Book V", chapters: "107-150" }
    ],
    timeline: [
      { event: "David's Early Psalms", date: "c. 1020 BC", reference: "Psalm 23" },
      { event: "Temple Psalms", date: "c. 960 BC", reference: "Psalm 84" },
      { event: "Exile Psalms", date: "c. 586 BC", reference: "Psalm 137" }
    ]
  },
  Proverbs: {
    author: "Solomon, Agur, Lemuel",
    dateWritten: "c. 971-686 BC",
    audience: "All seeking wisdom",
    purpose: "To provide practical wisdom for daily living",
    keyThemes: ["Wisdom", "Fear of the Lord", "Righteousness", "Discipline", "Character"],
    outline: [
      { title: "Wisdom's Call", chapters: "1-9" },
      { title: "Solomon's Proverbs", chapters: "10-22" },
      { title: "Sayings of the Wise", chapters: "23-24" },
      { title: "More Proverbs", chapters: "25-31" }
    ],
    timeline: [
      { event: "Solomon's Wisdom", date: "c. 971 BC", reference: "1 Kings 3" },
      { event: "Collection Completed", date: "c. 700 BC", reference: "Proverbs 25:1" }
    ]
  },
  Ecclesiastes: {
    author: "Solomon (the Preacher)",
    dateWritten: "c. 935 BC",
    audience: "All seeking meaning in life",
    purpose: "To show the vanity of life without God and the importance of fearing Him",
    keyThemes: ["Vanity", "Meaning", "Time", "Wisdom", "Fear of God"],
    outline: [
      { title: "Life's Vanity", chapters: "1-2" },
      { title: "Time and Eternity", chapters: "3-8" },
      { title: "Wisdom and Folly", chapters: "9-12" }
    ],
    timeline: [
      { event: "Solomon's Reflection", date: "c. 935 BC", reference: "Ecclesiastes 1" }
    ]
  },
  "Song of Solomon": {
    author: "Solomon",
    dateWritten: "c. 965 BC",
    audience: "Married couples and all believers",
    purpose: "To celebrate the beauty of love in marriage and God's love for His people",
    keyThemes: ["Love", "Marriage", "Beauty", "Devotion", "Intimacy"],
    outline: [
      { title: "Courtship", chapters: "1-3" },
      { title: "Wedding", chapters: "4-5" },
      { title: "Maturity in Love", chapters: "6-8" }
    ],
    timeline: [
      { event: "Solomon's Marriage", date: "c. 965 BC", reference: "Song 3:6-11" }
    ]
  },

  // New Testament - Gospels
  Matthew: {
    author: "Matthew (Levi)",
    dateWritten: "c. 58-68 AD",
    audience: "Jewish Christians",
    purpose: "To prove that Jesus is the promised Messiah and King of the Jews",
    keyThemes: ["Messiah", "Kingdom of Heaven", "Fulfillment", "Teaching", "Authority"],
    outline: [
      { title: "Birth and Early Life", chapters: "1-2" },
      { title: "Ministry Begins", chapters: "3-4" },
      { title: "Sermon on the Mount", chapters: "5-7" },
      { title: "Miracles and Parables", chapters: "8-25" },
      { title: "Passion and Resurrection", chapters: "26-28" }
    ],
    timeline: [
      { event: "Jesus' Birth", date: "c. 6-4 BC", reference: "Matthew 1-2" },
      { event: "Baptism", date: "c. 30 AD", reference: "Matthew 3" },
      { event: "Crucifixion", date: "c. 33 AD", reference: "Matthew 27" },
      { event: "Resurrection", date: "c. 33 AD", reference: "Matthew 28" }
    ]
  },
  Mark: {
    author: "John Mark",
    dateWritten: "c. 55-65 AD",
    audience: "Roman Christians",
    purpose: "To present Jesus as the suffering Servant and Son of God",
    keyThemes: ["Servant", "Action", "Suffering", "Discipleship", "Faith"],
    outline: [
      { title: "Servant's Preparation", chapters: "1:1-13" },
      { title: "Servant's Ministry", chapters: "1:14-8:30" },
      { title: "Servant's Sacrifice", chapters: "8:31-15:47" },
      { title: "Servant's Triumph", chapters: "16" }
    ],
    timeline: [
      { event: "Ministry Begins", date: "c. 30 AD", reference: "Mark 1" },
      { event: "Peter's Confession", date: "c. 32 AD", reference: "Mark 8" },
      { event: "Transfiguration", date: "c. 32 AD", reference: "Mark 9" }
    ]
  },
  Luke: {
    author: "Luke the physician",
    dateWritten: "c. 60-61 AD",
    audience: "Theophilus and Gentile Christians",
    purpose: "To provide an orderly account of Jesus' life and ministry",
    keyThemes: ["Humanity of Jesus", "Salvation", "Prayer", "Holy Spirit", "Social Justice"],
    outline: [
      { title: "Birth and Childhood", chapters: "1-2" },
      { title: "Preparation for Ministry", chapters: "3-4" },
      { title: "Galilean Ministry", chapters: "5-9" },
      { title: "Journey to Jerusalem", chapters: "10-19" },
      { title: "Passion Week", chapters: "20-24" }
    ],
    timeline: [
      { event: "Annunciation", date: "c. 6 BC", reference: "Luke 1" },
      { event: "Jesus at 12", date: "c. 7 AD", reference: "Luke 2" },
      { event: "Ascension", date: "c. 33 AD", reference: "Luke 24" }
    ]
  },
  John: {
    author: "John the Apostle",
    dateWritten: "c. 85-95 AD",
    audience: "All believers, especially those facing Gnostic influences",
    purpose: "That you may believe that Jesus is the Christ, the Son of God",
    keyThemes: ["Deity of Christ", "Eternal Life", "Love", "Light vs Darkness", "Belief"],
    outline: [
      { title: "Prologue", chapters: "1:1-18" },
      { title: "Public Ministry", chapters: "1:19-12:50" },
      { title: "Private Ministry", chapters: "13-17" },
      { title: "Passion and Resurrection", chapters: "18-21" }
    ],
    timeline: [
      { event: "Jesus' Baptism", date: "c. 30 AD", reference: "John 1:29-34" },
      { event: "First Miracle", date: "c. 30 AD", reference: "John 2:1-11" },
      { event: "Cleansing Temple", date: "c. 30 AD", reference: "John 2:13-22" },
      { event: "Crucifixion", date: "c. 33 AD", reference: "John 19" }
    ]
  },

  // New Testament - History
  Acts: {
    author: "Luke",
    dateWritten: "c. 62 AD",
    audience: "Theophilus and all Christians",
    purpose: "To record the spread of the Gospel and growth of the early church",
    keyThemes: ["Holy Spirit", "Church Growth", "Missions", "Persecution", "Unity"],
    outline: [
      { title: "Church in Jerusalem", chapters: "1-7" },
      { title: "Church in Judea/Samaria", chapters: "8-12" },
      { title: "Church to the Gentiles", chapters: "13-28" }
    ],
    timeline: [
      { event: "Pentecost", date: "c. 33 AD", reference: "Acts 2" },
      { event: "Paul's Conversion", date: "c. 35 AD", reference: "Acts 9" },
      { event: "First Missionary Journey", date: "c. 47-48 AD", reference: "Acts 13-14" }
    ]
  },

  // New Testament - Paul's Letters
  Romans: {
    author: "Paul",
    dateWritten: "c. 57 AD",
    audience: "Christians in Rome",
    purpose: "To explain the Gospel and God's plan of salvation",
    keyThemes: ["Justification", "Sin", "Grace", "Faith", "Sanctification"],
    outline: [
      { title: "Sin and Condemnation", chapters: "1-3" },
      { title: "Justification by Faith", chapters: "4-5" },
      { title: "Sanctification", chapters: "6-8" },
      { title: "Israel's Future", chapters: "9-11" },
      { title: "Christian Living", chapters: "12-16" }
    ],
    timeline: [
      { event: "Written from Corinth", date: "c. 57 AD", reference: "Romans 16:23" }
    ]
  },
  "1 Corinthians": {
    author: "Paul",
    dateWritten: "c. 55 AD",
    audience: "Church in Corinth",
    purpose: "To address problems in the Corinthian church",
    keyThemes: ["Unity", "Spiritual Gifts", "Love", "Resurrection", "Church Discipline"],
    outline: [
      { title: "Church Problems", chapters: "1-6" },
      { title: "Marriage and Freedom", chapters: "7-10" },
      { title: "Worship and Gifts", chapters: "11-14" },
      { title: "Resurrection", chapters: "15" },
      { title: "Collection", chapters: "16" }
    ],
    timeline: [
      { event: "Written from Ephesus", date: "c. 55 AD", reference: "1 Corinthians 16:8" }
    ]
  },
  "2 Corinthians": {
    author: "Paul",
    dateWritten: "c. 56 AD",
    audience: "Church in Corinth",
    purpose: "To defend Paul's apostolic authority and encourage reconciliation",
    keyThemes: ["Apostolic Authority", "Suffering", "Comfort", "Giving", "Weakness"],
    outline: [
      { title: "Paul's Ministry", chapters: "1-7" },
      { title: "Collection for Jerusalem", chapters: "8-9" },
      { title: "Paul's Defense", chapters: "10-13" }
    ],
    timeline: [
      { event: "Written from Macedonia", date: "c. 56 AD", reference: "2 Corinthians 2:13" }
    ]
  },
  Galatians: {
    author: "Paul",
    dateWritten: "c. 49 AD",
    audience: "Churches in Galatia",
    purpose: "To defend justification by faith against legalism",
    keyThemes: ["Justification by Faith", "Freedom", "Law vs Grace", "Spirit vs Flesh", "Gospel"],
    outline: [
      { title: "Paul's Authority", chapters: "1-2" },
      { title: "Justification by Faith", chapters: "3-4" },
      { title: "Freedom in Christ", chapters: "5-6" }
    ],
    timeline: [
      { event: "Judaizers' Influence", date: "c. 49 AD", reference: "Galatians 1:6" }
    ]
  },
  Ephesians: {
    author: "Paul",
    dateWritten: "c. 60-62 AD",
    audience: "Church in Ephesus and surrounding area",
    purpose: "To explain the believer's position and walk in Christ",
    keyThemes: ["Unity", "Church", "Spiritual Blessings", "Walk", "Armor of God"],
    outline: [
      { title: "Our Position in Christ", chapters: "1-3" },
      { title: "Our Walk in Christ", chapters: "4-6" }
    ],
    timeline: [
      { event: "Written from Prison", date: "c. 60-62 AD", reference: "Ephesians 3:1" }
    ]
  },
  Philippians: {
    author: "Paul",
    dateWritten: "c. 61 AD",
    audience: "Church in Philippi",
    purpose: "To express gratitude and encourage joy despite circumstances",
    keyThemes: ["Joy", "Partnership", "Humility", "Contentment", "Christ's Example"],
    outline: [
      { title: "Joy in Suffering", chapters: "1" },
      { title: "Joy in Serving", chapters: "2" },
      { title: "Joy in Believing", chapters: "3" },
      { title: "Joy in Giving", chapters: "4" }
    ],
    timeline: [
      { event: "Written from Prison", date: "c. 61 AD", reference: "Philippians 1:13" }
    ]
  },
  Colossians: {
    author: "Paul",
    dateWritten: "c. 60-62 AD",
    audience: "Church in Colossae",
    purpose: "To combat false teaching and exalt Christ's supremacy",
    keyThemes: ["Supremacy of Christ", "False Teaching", "Spiritual Growth", "New Life", "Wisdom"],
    outline: [
      { title: "Christ's Supremacy", chapters: "1-2" },
      { title: "Christian Living", chapters: "3-4" }
    ],
    timeline: [
      { event: "Written from Prison", date: "c. 60-62 AD", reference: "Colossians 4:18" }
    ]
  },
  "1 Thessalonians": {
    author: "Paul",
    dateWritten: "c. 51 AD",
    audience: "Church in Thessalonica",
    purpose: "To encourage new believers and teach about Christ's return",
    keyThemes: ["Second Coming", "Encouragement", "Holy Living", "Work Ethic", "Hope"],
    outline: [
      { title: "Thanksgiving", chapters: "1-3" },
      { title: "Exhortation", chapters: "4-5" }
    ],
    timeline: [
      { event: "Written from Corinth", date: "c. 51 AD", reference: "Acts 18:1-5" }
    ]
  },
  "2 Thessalonians": {
    author: "Paul",
    dateWritten: "c. 51-52 AD",
    audience: "Church in Thessalonica",
    purpose: "To correct misunderstandings about the Day of the Lord",
    keyThemes: ["Day of the Lord", "Persecution", "Work", "False Teaching", "Perseverance"],
    outline: [
      { title: "Encouragement in Persecution", chapters: "1" },
      { title: "Day of the Lord", chapters: "2" },
      { title: "Christian Conduct", chapters: "3" }
    ],
    timeline: [
      { event: "Written from Corinth", date: "c. 51-52 AD", reference: "Acts 18" }
    ]
  },
  "1 Timothy": {
    author: "Paul",
    dateWritten: "c. 62-64 AD",
    audience: "Timothy",
    purpose: "To provide instructions for church leadership and organization",
    keyThemes: ["Church Leadership", "False Teaching", "Godliness", "Pastoral Care", "Sound Doctrine"],
    outline: [
      { title: "Charge Concerning Doctrine", chapters: "1" },
      { title: "Charge Concerning Public Worship", chapters: "2-3" },
      { title: "Charge Concerning False Teachers", chapters: "4" },
      { title: "Charge Concerning Church Discipline", chapters: "5-6" }
    ],
    timeline: [
      { event: "Paul's Release from Prison", date: "c. 62 AD", reference: "1 Timothy 1:3" }
    ]
  },
  "2 Timothy": {
    author: "Paul",
    dateWritten: "c. 67 AD",
    audience: "Timothy",
    purpose: "Paul's final letter, encouraging Timothy to remain faithful",
    keyThemes: ["Faithfulness", "Suffering", "Scripture", "Endurance", "Legacy"],
    outline: [
      { title: "Encouragement to Be Faithful", chapters: "1" },
      { title: "Encouragement to Be Strong", chapters: "2" },
      { title: "Warning About Last Days", chapters: "3" },
      { title: "Paul's Final Charge", chapters: "4" }
    ],
    timeline: [
      { event: "Paul's Final Imprisonment", date: "c. 67 AD", reference: "2 Timothy 1:8" }
    ]
  },
  Titus: {
    author: "Paul",
    dateWritten: "c. 62-64 AD",
    audience: "Titus",
    purpose: "To provide guidance for organizing the church in Crete",
    keyThemes: ["Church Organization", "Good Works", "Sound Doctrine", "Christian Conduct", "Grace"],
    outline: [
      { title: "Qualifications for Elders", chapters: "1" },
      { title: "Instructions for Different Groups", chapters: "2" },
      { title: "Christian Conduct", chapters: "3" }
    ],
    timeline: [
      { event: "Titus Left in Crete", date: "c. 62-64 AD", reference: "Titus 1:5" }
    ]
  },
  Philemon: {
    author: "Paul",
    dateWritten: "c. 60-62 AD",
    audience: "Philemon",
    purpose: "To request forgiveness for the runaway slave Onesimus",
    keyThemes: ["Forgiveness", "Reconciliation", "Christian Brotherhood", "Love", "Transformation"],
    outline: [
      { title: "Greeting and Thanksgiving", chapters: "1-7" },
      { title: "Appeal for Onesimus", chapters: "8-22" },
      { title: "Final Greetings", chapters: "23-25" }
    ],
    timeline: [
      { event: "Written from Prison", date: "c. 60-62 AD", reference: "Philemon 1" }
    ]
  },
  Hebrews: {
    author: "Unknown (possibly Paul, Apollos, or Barnabas)",
    dateWritten: "c. 64-68 AD",
    audience: "Hebrew Christians",
    purpose: "To show the superiority of Christ and encourage perseverance",
    keyThemes: ["Superiority of Christ", "Faith", "Perseverance", "Priesthood", "Covenant"],
    outline: [
      { title: "Christ Superior to Prophets and Angels", chapters: "1-2" },
      { title: "Christ Superior to Moses", chapters: "3-4" },
      { title: "Christ Superior to Aaron", chapters: "5-10" },
      { title: "Faith and Endurance", chapters: "11-13" }
    ],
    timeline: [
      { event: "Before Temple Destruction", date: "c. 64-68 AD", reference: "Hebrews 8:4" }
    ]
  },
  James: {
    author: "James, brother of Jesus",
    dateWritten: "c. 45-50 AD",
    audience: "Jewish Christians scattered abroad",
    purpose: "To encourage practical Christian living and genuine faith",
    keyThemes: ["Practical Faith", "Trials", "Wisdom", "Works", "Speech"],
    outline: [
      { title: "Faith and Trials", chapters: "1" },
      { title: "Faith and Works", chapters: "2" },
      { title: "Faith and Speech", chapters: "3" },
      { title: "Faith and Worldliness", chapters: "4-5" }
    ],
    timeline: [
      { event: "Early Church Period", date: "c. 45-50 AD", reference: "James 1:1" }
    ]
  },
  "1 Peter": {
    author: "Peter",
    dateWritten: "c. 62-64 AD",
    audience: "Christians in Asia Minor",
    purpose: "To encourage believers facing persecution",
    keyThemes: ["Suffering", "Hope", "Holiness", "Submission", "Perseverance"],
    outline: [
      { title: "Salvation and Holiness", chapters: "1-2" },
      { title: "Submission and Suffering", chapters: "3-4" },
      { title: "Leadership and Humility", chapters: "5" }
    ],
    timeline: [
      { event: "Nero's Persecution", date: "c. 62-64 AD", reference: "1 Peter 4:12" }
    ]
  },
  "2 Peter": {
    author: "Peter",
    dateWritten: "c. 65-68 AD",
    audience: "Same as 1 Peter",
    purpose: "To warn against false teachers and encourage spiritual growth",
    keyThemes: ["False Teachers", "Knowledge", "Day of the Lord", "Scripture", "Growth"],
    outline: [
      { title: "Growth in Grace", chapters: "1" },
      { title: "Warning Against False Teachers", chapters: "2" },
      { title: "Day of the Lord", chapters: "3" }
    ],
    timeline: [
      { event: "Peter's Impending Death", date: "c. 65-68 AD", reference: "2 Peter 1:14" }
    ]
  },
  "1 John": {
    author: "John the Apostle",
    dateWritten: "c. 85-95 AD",
    audience: "Christians in Asia Minor",
    purpose: "To provide assurance of salvation and combat false teaching",
    keyThemes: ["Love", "Light", "Life", "Assurance", "Fellowship"],
    outline: [
      { title: "Fellowship with God", chapters: "1-2" },
      { title: "Children of God", chapters: "3" },
      { title: "Testing the Spirits", chapters: "4" },
      { title: "Assurance of Eternal Life", chapters: "5" }
    ],
    timeline: [
      { event: "Gnostic Influence", date: "c. 85-95 AD", reference: "1 John 4:1-3" }
    ]
  },
  "2 John": {
    author: "John the Apostle",
    dateWritten: "c. 85-95 AD",
    audience: "The elect lady and her children",
    purpose: "To warn against false teachers and emphasize love and truth",
    keyThemes: ["Truth", "Love", "False Teachers", "Hospitality", "Obedience"],
    outline: [
      { title: "Greeting", chapters: "1-3" },
      { title: "Walking in Truth and Love", chapters: "4-6" },
      { title: "Warning Against Deceivers", chapters: "7-11" },
      { title: "Conclusion", chapters: "12-13" }
    ],
    timeline: [
      { event: "Same as 1 John", date: "c. 85-95 AD", reference: "2 John 7" }
    ]
  },
  "3 John": {
    author: "John the Apostle",
    dateWritten: "c. 85-95 AD",
    audience: "Gaius",
    purpose: "To commend Gaius for his hospitality and warn against Diotrephes",
    keyThemes: ["Hospitality", "Truth", "Church Leadership", "Fellowship", "Good vs Evil"],
    outline: [
      { title: "Commendation of Gaius", chapters: "1-8" },
      { title: "Condemnation of Diotrephes", chapters: "9-10" },
      { title: "Commendation of Demetrius", chapters: "11-12" },
      { title: "Conclusion", chapters: "13-14" }
    ],
    timeline: [
      { event: "Same as 1 John", date: "c. 85-95 AD", reference: "3 John 9" }
    ]
  },
  Jude: {
    author: "Jude, brother of James",
    dateWritten: "c. 65-80 AD",
    audience: "All Christians",
    purpose: "To warn against false teachers and encourage believers to contend for the faith",
    keyThemes: ["False Teachers", "Apostasy", "Judgment", "Faith", "Perseverance"],
    outline: [
      { title: "Purpose for Writing", chapters: "1-4" },
      { title: "Examples of Judgment", chapters: "5-16" },
      { title: "Exhortation to Believers", chapters: "17-25" }
    ],
    timeline: [
      { event: "Apostolic Period", date: "c. 65-80 AD", reference: "Jude 17" }
    ]
  },
  Revelation: {
    author: "John the Apostle",
    dateWritten: "c. 95 AD",
    audience: "Seven churches in Asia Minor",
    purpose: "To reveal Jesus Christ and encourage believers facing persecution",
    keyThemes: ["Revelation of Christ", "Judgment", "Victory", "Worship", "New Creation"],
    outline: [
      { title: "Letters to Seven Churches", chapters: "1-3" },
      { title: "Throne Room Vision", chapters: "4-5" },
      { title: "Seven Seals", chapters: "6-8" },
      { title: "Seven Trumpets", chapters: "8-11" },
      { title: "Seven Bowls", chapters: "15-16" },
      { title: "Babylon's Fall", chapters: "17-18" },
      { title: "Christ's Return", chapters: "19-20" },
      { title: "New Heaven and Earth", chapters: "21-22" }
    ],
    timeline: [
      { event: "John's Exile", date: "c. 95 AD", reference: "Revelation 1:9" },
      { event: "Vision Received", date: "c. 95 AD", reference: "Revelation 1:10" }
    ]
  }
};