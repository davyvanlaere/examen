using System;
using System.Collections.Generic;
using System.Text;

namespace VragenLijstJson
{
    public class QuestionInfo
    {
        public int Id { get; set; }
        public string Question { get; set; }
        public string CorrectAnswer { get; set; } = " ";

        public List<Answer> Answers { get; set; } = new List<Answer>();

        public override string ToString()
        {
            return $"{Question} ({Answers?.Count ?? 0})";
        }
    }
}
