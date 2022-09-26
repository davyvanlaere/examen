using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Runtime.InteropServices;
using System.Text.RegularExpressions;

namespace VragenLijstJson
{
    class Program
    {
        // vragenlijst.pdf -> ctrl+a -> ctrl+v + beetje opkuis (titles per page wegnemen)
        private static Regex _questionRegex = new Regex(@"^(?<id>[0-9]*\.){1}(?<title>.+)", RegexOptions.Compiled);
        private static Regex _answerRegex = new Regex(@"^((?<id>[abcABC]{1})\.){1}(?<title>.+)", RegexOptions.Compiled);
        private static Regex _pageTitleRegex = new Regex(@"[0-9]+Vragenlijst \(voorlopige\) sportschutterslicentie", RegexOptions.Compiled);
        private static Regex _justANumberRegex = new Regex(@"^[0-9]*$", RegexOptions.Compiled);

        private static Regex[] _regexes = new Regex[] {
            _questionRegex,
            _answerRegex,
        };

        static void Main(string[] args)
        {
            var questions = ReadQuestionsAndAnswers();
            var solutions = GetSolutions();

            foreach (var question in questions)
            {
                question.CorrectAnswer = solutions[question.Id];
            }

            var json = JsonConvert.SerializeObject(questions, Formatting.Indented);

            File.WriteAllText("questions.json", json);
        }

        private static Dictionary<int, string> GetSolutions()
        {
            var solutionLines = File.ReadAllLines(@"antwoorden2022.txt")
                .Where(l => !string.IsNullOrWhiteSpace(l))
                .ToArray();

            var solutionRegex = new Regex("(?<id>[0-9]*) - (?<answer>[A-C]{1})", RegexOptions.Compiled);

            return solutionLines
                .SelectMany(line => solutionRegex.Matches(line))
                .ToDictionary(k => Convert.ToInt32(k.Groups["id"].Value), k => k.Groups["answer"].Value);
        }

        private static List<QuestionInfo> ReadQuestionsAndAnswers()
        {
            var lines = File.ReadAllLines(@"vragenlijst2022.txt")
                .Select(s => s.Trim())
                .Where(l => !string.IsNullOrWhiteSpace(l))
                .Where(l => !_pageTitleRegex.IsMatch(l))
                .Where(l => !_justANumberRegex.IsMatch(l)).ToArray();

            var condensedLines = new List<string>();
            foreach (var line in lines)
            {
                if (_questionRegex.IsMatch(line) || _answerRegex.IsMatch(line))
                {
                    condensedLines.Add(line);
                }
                else
                {
                    condensedLines[condensedLines.Count - 1] += $" {line}";
                }
            }

            var questions = new List<QuestionInfo>();
            QuestionInfo currentQuestion = null;
            var id = 0;
            for (var idx = 0; idx < condensedLines.Count; idx++)
            {
                var line = condensedLines[idx];
                var modulo = idx % 4;
                if (modulo == 0)
                {
                    currentQuestion = new QuestionInfo();
                    questions.Add(currentQuestion);

                    var match = _questionRegex.Match(line);
                    if (match.Success)
                    {
                        currentQuestion.Question = match.Groups["title"].Value.Trim();
                        currentQuestion.Id = ++id;
                    }
                    else
                    {
                        throw new Exception();
                    }
                }
                else
                {
                    var match = _answerRegex.Match(line);
                    if (match.Success)
                    {
                        currentQuestion.Answers.Add(new Answer
                        {
                            Id = match.Groups["id"].Value.ToUpper(),
                            Text = match.Groups["title"].Value.Trim()
                        });
                    }
                    else
                    {
                        throw new Exception();
                    }
                }
            }

            return questions;
        }
    }
}
