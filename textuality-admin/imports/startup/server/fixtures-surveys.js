import Surveys from 'api/surveys';

if (!Surveys.findOne()) {
  Surveys.insert({
    week: 1,
    season: '11',
    published: true,
    sections: [
      {
        optional: false,
        questionType: 'queens',
        questionData: {
          numQueens: 5,
          queensFrom: 'episode'
        },
        saveTo: 'bench',
        text: "Who's on your bench?",
        subText: "Select 5! They'll follow you around for a few episodes.",
        id: 'oWceNogrYfX5a66Gm'
      },
      {
        optional: false,
        questionType: 'queens',
        questionData: {
          numQueens: 2,
          queensFrom: 'bench'
        },
        saveTo: 'winner',
        text: "Who's gonna slay this challenge?",
        subText: 'You get to pick two. If either wins you get 5 points!',
        id: '5JjaHZJbwwPwPPtBM'
      },
      {
        optional: false,
        questionType: 'queens',
        questionData: {
          numQueens: 2,
          queensFrom: 'episode'
        },
        saveTo: 'loser',
        text: 'Who looozes?',
        subText:
          "Pick two queens who you think could lose. 5 points if you're right",
        id: 'PodAqpM4BZEBJCA6e'
      },
      {
        optional: true,
        questionType: 'text',
        saveTo: 'qotw',
        questionData: {
          inputType: 'text',
          label: 'Drag Name'
        },
        text: 'Q of the Week',
        subText: "What's your drag name?",
        id: 'fHXLgcHygzg5EAwQa'
      }
    ]
  });

  Surveys.insert({
    week: 2,
    season: '11',
    published: false,
    sections: [
      {
        optional: false,
        questionType: 'queens',
        questionData: {
          numQueens: 2,
          queensFrom: 'bench'
        },
        saveTo: 'winner',
        text: "Who's gonna slay this challenge?",
        subText: 'You get to pick two. If either wins you get 5 points!',
        id: '5JjaHZJbwwPwPPtBM'
      },
      {
        optional: false,
        questionType: 'queens',
        questionData: {
          numQueens: 2,
          queensFrom: 'episode'
        },
        saveTo: 'loser',
        text: 'Who looozes?',
        subText: 'Pick two queens who you think could lose.',
        id: 'PodAqpM4BZEBJCA6e'
      },
      {
        optional: true,
        questionType: 'text',
        saveTo: 'qotw',
        questionData: {
          inputType: 'text'
        },
        text: 'Come up with a runway theme!',
        subText:
          'Last week, the theme was Corporate Drag. What runway theme would you challenge these queens to slay?',
        id: 'fHXLgcHygzg5EAwQa'
      }
    ]
  });
}
