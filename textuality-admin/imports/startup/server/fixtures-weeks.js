import Weeks from 'api/weeks';

if (!Weeks.findOne()) {
  Weeks.insert({
    number: 1,
    season: 'dev',
    dateBegin: new Date(2019, 0, 3, 20, 0, 0),
    dateEnd: new Date(2019, 0, 10, 20, 0, 0),
    dateSurveyOpen: new Date(2019, 0, 3, 20, 0, 0),
    dateSurveyClose: new Date(2019, 0, 7, 20, 0, 0),
    dateEpisodeStart: new Date(2019, 0, 7, 20, 0, 0),
    dateEpisodeEnd: new Date(2019, 0, 7, 21, 0, 0),
    datePollOpen: new Date(2019, 0, 7, 20, 0, 0),
    datePollClose: new Date(2019, 0, 9, 20, 0, 0),
    dateResultsPoll: new Date(2019, 0, 10, 8, 0, 0),
    dateResultsWeek: new Date(2019, 0, 9, 8, 0, 0),
    dateResultsCum: new Date(2019, 0, 10, 10, 0, 0)
  });

  Weeks.insert({
    number: 2,
    season: 'dev',
    dateBegin: new Date(2019, 0, 10, 20, 0, 0),
    dateEnd: new Date(2019, 0, 17, 20, 0, 0),
    dateSurveyOpen: new Date(2019, 0, 10, 20, 0, 0),
    dateSurveyClose: new Date(2019, 0, 14, 20, 0, 0),
    dateEpisodeStart: new Date(2019, 0, 14, 20, 0, 0),
    dateEpisodeEnd: new Date(2019, 0, 14, 21, 0, 0),
    datePollOpen: new Date(2019, 0, 14, 20, 0, 0),
    datePollClose: new Date(2019, 0, 16, 20, 0, 0),
    dateResultsPoll: new Date(2019, 0, 17, 8, 0, 0),
    dateResultsWeek: new Date(2019, 0, 16, 8, 0, 0),
    dateResultsCum: new Date(2019, 0, 17, 10, 0, 0)
  });

  Weeks.insert({
    number: 0,
    season: '11',
    dateBegin: new Date(2019, 1, 17, 20, 0, 0),
    dateEnd: new Date(2019, 1, 28, 21, 0, 0),
    dateEpisodeStart: new Date(2019, 1, 28, 20, 0, 0),
    dateEpisodeEnd: new Date(2019, 1, 28, 21, 0, 0)
  });

  Weeks.insert({
    number: 1,
    season: '11',
    dateBegin: new Date(2019, 1, 28, 21, 0, 0),
    dateEnd: new Date(2019, 2, 10, 20, 0, 0),
    dateSurveyOpen: new Date(2019, 1, 28, 21, 0, 0),
    dateSurveyClose: new Date(2019, 2, 7, 20, 0, 0),
    dateEpisodeStart: new Date(2019, 2, 7, 20, 0, 0),
    dateEpisodeEnd: new Date(2019, 2, 7, 21, 0, 0),
    datePollOpen: new Date(2019, 2, 7, 20, 0, 0),
    datePollClose: new Date(2019, 2, 9, 20, 0, 0),
    dateResultsWeek: new Date(2019, 2, 9, 8, 0, 0),
    dateResultsPoll: new Date(2019, 2, 10, 8, 0, 0),
    dateResultsCum: new Date(2019, 2, 10, 8, 0, 0)
  });

  Weeks.insert({
    number: 2,
    season: '11',
    dateBegin: new Date(2019, 2, 10, 20, 0, 0),
    dateEnd: new Date(2019, 2, 17, 20, 0, 0),
    dateSurveyOpen: new Date(2019, 2, 10, 20, 0, 0),
    dateSurveyClose: new Date(2019, 2, 14, 20, 0, 0),
    dateEpisodeStart: new Date(2019, 2, 14, 20, 0, 0),
    dateEpisodeEnd: new Date(2019, 2, 14, 21, 0, 0),
    datePollOpen: new Date(2019, 2, 14, 20, 0, 0),
    datePollClose: new Date(2019, 2, 16, 20, 0, 0),
    dateResultsWeek: new Date(2019, 2, 16, 8, 0, 0),
    dateResultsPoll: new Date(2019, 2, 17, 8, 0, 0),
    dateResultsCum: new Date(2019, 2, 17, 8, 0, 0)
  });

  Weeks.insert({
    number: 3,
    season: '11',
    dateBegin: new Date(2019, 2, 17, 20, 0, 0),
    dateEnd: new Date(2019, 2, 24, 20, 0, 0),
    dateSurveyOpen: new Date(2019, 2, 17, 20, 0, 0),
    dateSurveyClose: new Date(2019, 2, 21, 20, 0, 0),
    dateEpisodeStart: new Date(2019, 2, 21, 20, 0, 0),
    dateEpisodeEnd: new Date(2019, 2, 21, 21, 0, 0),
    datePollOpen: new Date(2019, 2, 21, 20, 0, 0),
    datePollClose: new Date(2019, 2, 23, 20, 0, 0),
    dateResultsWeek: new Date(2019, 2, 23, 8, 0, 0),
    dateResultsPoll: new Date(2019, 2, 24, 8, 0, 0),
    dateResultsCum: new Date(2019, 2, 24, 8, 0, 0)
  });
}
