import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { QuestionInfo } from './services/question';
import { QuestionRandomizerService } from './services/question-randomizer-service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public maxQuestions: number = 15;
  public minimumRequired: number = 9;
  public currentQuestion: QuestionInfo | undefined;
  public results: QuestionInfo[] = [];
  public correctAnswers: number = 0;
  public progressPercentage: number = 0;
  public testPassed: boolean = false;
  public showSummary: boolean = false;
  public club: 'chapel' | 'snps' = 'chapel';

  constructor(private randomService: QuestionRandomizerService, private route: ActivatedRoute) {

  }

  ngOnInit(): void {
    this.initialize();
  }

  private nextRandomQuestion() {
    this.currentQuestion = this.randomService.getRandomQuestion();
  }

  public setAnswer(question: QuestionInfo, answerId: string) {
    if (!question.SuppliedAnswer) {
      question.SuppliedAnswer = answerId;
      this.results.push(question);
      question.Result = question.CorrectAnswer == question.SuppliedAnswer;
      if (question.Result === true) {
        this.correctAnswers++;
      }
      this.progressPercentage = Math.floor((this.results.length / this.maxQuestions) * 100);
      this.testPassed = this.correctAnswers >= this.minimumRequired;
    }
  }

  public next() {
    if (this.results.length < this.maxQuestions)
    {
      this.nextRandomQuestion();
    }
    else {
      this.showSummary = true;
    }
  }

  public initialize() {
    this.club = window.location.href.indexOf('snps') > -1 ? 'snps' : 'chapel';
    this.showSummary = false;
    this.results = [];
    this.correctAnswers = 0;
    this.progressPercentage = 0;
    this.testPassed = false;
    this.nextRandomQuestion();
  }
}
