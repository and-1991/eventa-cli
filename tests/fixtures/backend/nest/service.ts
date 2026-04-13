/* eslint-disable */

declare function track(event: string): void;

function Injectable(): any {
  return () => {};
}

function Controller(): any {
  return () => {};
}

function Get(): any {
  return () => {};
}

function Post(): any {
  return () => {};
}

// ===== service =====
@Injectable()
export class TestService {
  run() {
    track("nest_event");
  }

  async asyncRun() {
    track("async_event");
  }

  arrow = () => {
    track("arrow_event");
  };
}

// ===== controller =====
@Controller()
export class TestController {
  @Get()
  get() {
    track("get_event");
  }

  @Post()
  post() {
    track("post_event");
  }

  nested() {
    if (true) {
      track("nested_event");
    }
  }
}

// ===== function =====
function service() {
  track("function_event");
}

// ===== class =====
class AnotherService {
  run() {
    track("class_event");
  }
}

// ===== direct =====
track("direct_event");
