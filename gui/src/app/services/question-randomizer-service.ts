import { JsonPipe } from '@angular/common';
import { Injectable } from '@angular/core';
import data from '../../assets/json/questions.json';
import { QuestionInfo } from './question';

@Injectable()
export class QuestionRandomizerService {

    private allQuestions: QuestionInfo[] = data;

    public getRandomQuestion() : QuestionInfo {
        let storedList = this.GetRemainingListFromStorage();
        let selectionList = storedList.length > 0 
            ? storedList 
            : this.allQuestions.map(i => i.Id); 

        var questionId = selectionList.splice(Math.floor(Math.random() * selectionList.length), 1)[0];

        this.SaveRemainingListToStorage(selectionList);

        let item = this.allQuestions.find(i => i.Id == questionId);
        if (!item) {
            debugger;
        }
        return item;
    }

    private SaveRemainingListToStorage(selectionList: number[]) {
        console.log(selectionList.length);
        var serialised = JSON.stringify(selectionList);
        localStorage.setItem('remaining', serialised);
    }

    private GetRemainingListFromStorage() : number[] {
        let value = localStorage.getItem('remaining');
        if (value) {
            return JSON.parse(value);
        }
        return [];
    }
}