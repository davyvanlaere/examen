using System;
using System.Collections.Generic;
using System.Text;

namespace VragenLijstJson
{
    public class Answer
    {
        public string Id { get; set; }
        public string Text { get; set; }

        public override string ToString()
        {
            return $"[{Id}] {Text}";
        }
    }
}
