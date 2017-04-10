class UIUtilities {
  constructor() {
    this.espn_cdn_lookup = {
      "ATL":"atl",
      "BOS":"bos",
      "BRK":"bkn",
      "CHO":"cha",
      "CHI":"chi",
      "CLE":"cle",
      "DAL":"dal",
      "DEN":"den",
      "DET":"det",
      "GSW":"gs",
      "HOU":"hou",
      "IND":"ind",
      "LAC":"lac",
      "LAL":"lal",
      "MEM":"mem",
      "MIA":"mia",
      "MIL":"mil",
      "MIN":"min",
      "NOP":"no",
      "NYK":"ny",
      "OKC":"okc",
      "ORL":"orl",
      "PHI":"phi",
      "PHO":"phx",
      "POR":"por",
      "SAC":"sac",
      "SAS":"sa",
      "TOR":"tor",
      "UTA":"utah",
      "WAS":"wsh"
    };

    this.alternate_logo_lookup = {
      'NJN': 'http://vignette2.wikia.nocookie.net/nba2k/images/4/45/New_Jersey_Nets_Logo.png/revision/latest?cb=20120119223413',
      'CHA': 'http://vignette2.wikia.nocookie.net/nba2k/images/e/e5/Charlotte_Bobcats_Logo.png/revision/latest?cb=20120119223259',
      'NOH': 'http://vignette2.wikia.nocookie.net/nba2k/images/0/0f/New_Orleans_Hornets_Logo.png/revision/latest?cb=20120119223414',
      'NOK': 'http://vignette2.wikia.nocookie.net/nba2k/images/0/0f/New_Orleans_Hornets_Logo.png/revision/latest?cb=20120119223414',
      'SEA': 'https://upload.wikimedia.org/wikipedia/en/thumb/a/a4/Seattle_SuperSonics_logo.svg/966px-Seattle_SuperSonics_logo.svg.png'
    };

    this.teamColorLookup = {
      'ATL':'#ff3333',
      'BOS':'#006622',
      'BRK':'#cccccc',
      'CHO':'#0099cc',
      'CHI':'#cc0000',
      'CLE':'#800000',
      'DAL':'#005be6',
      'DEN':'#33adff',
      'DET':'#0052cc',
      'GSW':'#ffcc00',
      'HOU':'#cc0000',
      'IND':'#ffdb4d',
      'LAC':'#ff1a1a',
      'LAL':'#80007f',
      'MEM':'#2929a3',
      'MIA':'#e60000',
      'MIL':'#004d00',
      'MIN':'#2951a3',
      'NOP':'#e6ac00',
      'NYK':'#ffae33',
      'OKC':'#ff8433',
      'ORL':'#00ace6',
      'PHI':'#0066ff',
      'PHO':'#7200e6',
      'POR':'#cc0000',
      'SAC':'#5900b3',
      'SAS':'#777777',
      'TOR':'#cc0000',
      'UTA':'#0000b3',
      'WAS':'#000080',
      'NJN':'#262673',
      'CHA':'#ff592b',
      'NOH':'#0fa4cd',
      'NOK':'#0fa4cd',
      'SEA':'#006a00'
    };

    this.getLogoURL = this.getLogoURL.bind(this);
  }

  getLogoURL(teamAbbreviation, width, height) {
    width = width || 50;
    height = height || 50;

    if (!this.espn_cdn_lookup.hasOwnProperty(teamAbbreviation)) {
      return this.alternate_logo_lookup[teamAbbreviation];
    }

    const base_url = "http://a1.espncdn.com/combiner/i?img=/i/teamlogos/nba/500/scoreboard/";
    const extension = ".png";
    var size_suffix = "&w=" + width.toString() + "&h=" + height.toString();

    return base_url + this.espn_cdn_lookup[teamAbbreviation] + extension + size_suffix;
  };

}

export default UIUtilities;
