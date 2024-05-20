import { Injectable } from '@angular/core';
import data from '../../assets/json/questions2022.json';
import { QuestionInfo } from './question';

@Injectable({ providedIn: 'root' })
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
        let copy: QuestionInfo = JSON.parse(JSON.stringify(item));
        copy.Total = this.allQuestions.length;
        copy.TotalRemaining = selectionList.length;

        return copy;
    }

    private SaveRemainingListToStorage(selectionList: number[]) {
        console.log(selectionList.length);
        var serialised = JSON.stringify(selectionList);
        localStorage.setItem('remaining2022', serialised);
    }

    private GetRemainingListFromStorage() : number[] {
        let value = localStorage.getItem('remaining2022');
        if (value) {
            return JSON.parse(value);
        }
        return [];
    }
}
