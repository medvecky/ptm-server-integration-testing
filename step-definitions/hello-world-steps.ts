import {binding, given, then, when} from 'cucumber-tsflow';
import {isItFriday} from './hello-world-functions';
import {assertThat, is} from 'hamjest';
import axios from "axios";

@binding()
export class HelloWorldSteps {

    private today: string;
    private actualAnswer: string;
    private response: object;

    // @ts-ignore
    @given(/today is "(.*)"/)
    public today_is_day(dayName: string): void {
        this.today = dayName;
    }

    // @ts-ignore
    @when(/I ask whether it's Friday yet/)
    public ask_is_it_friday(): void {
        this.actualAnswer = isItFriday(this.today);
    }

    // @ts-ignore
    @then(/I should be told "(\w*)"/)
    public i_should_be_told(expectedAnswer: string): void {
        assertThat(this.actualAnswer, is(expectedAnswer))
    }
}

