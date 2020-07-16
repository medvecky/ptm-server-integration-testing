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

    // @ts-ignore
    @when(/user makes request/)
    public user_makes_request() {

    }

    // @ts-ignore
    @then(/user receives response/)
    public user_receives_response() {
       return  axios.get('http://localhost:3000')
            .then(function (respose) {
            })
            .catch(function (error) {
                assertThat(error.response.data.statusCode, is(404))
            });
    }
}

