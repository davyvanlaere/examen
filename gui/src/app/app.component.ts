import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { QuestionInfo } from './services/question';
import { QuestionRandomizerService } from './services/question-randomizer-service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public maxQuestions: number = 15;
  public minimumRequired: number = 9;
  public currentQuestion: QuestionInfo;
  public results: QuestionInfo[] = [];
  public correctAnswers: number = 0;
  public progressPercentage: number = 0;
  public testPassed: boolean = false;
  public showSummary: boolean = false;

  constructor(private randomService: QuestionRandomizerService) {

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
    this.showSummary = false;
    this.results = []; 
    this.correctAnswers = 0;
    this.progressPercentage = 0;
    this.testPassed = false;
    this.nextRandomQuestion();
  }
}
