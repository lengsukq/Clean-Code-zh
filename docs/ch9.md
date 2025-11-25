# 第 9 章 单元测试 (Unit Tests)

## 总结 (Summary)

本章的核心观点是：**测试代码与生产代码同等重要**。Robert C. Martin 强调，编写单元测试不仅是为了验证程序是否工作，更是为了保持代码的灵活性、可维护性和可重用性。如果测试代码写得很烂（"脏"），随着系统的演进，它们将变成维护的噩梦，最终导致测试套件被抛弃，进而引发生产代码的腐烂。

作者详细介绍了 TDD（测试驱动开发）的三大定律，提倡保持测试代码的整洁（Clean Tests），并提出了测试代码的特定标准（F.I.R.S.T. 原则）。此外，书中还讨论了如何通过构建领域特定测试语言（Domain-Specific Testing Language）来提高测试的可读性，以及在测试环境中可以接受但在生产环境中不能接受的“双重标准”。

## 小计 (Key Takeaways)

1.  **TDD 三大定律**：
    *   在编写失败的测试之前，不可编写生产代码。
    *   只要测试失败（包括编译失败），就不能编写更多的测试代码。
    *   生产代码只需写到能让当前失败的测试通过即可。
2.  **脏测试等同于没测试**：测试代码必须随着生产代码演进。如果测试代码难以维护，开发者就会停止维护它，最终导致系统失去保护网。
3.  **测试带来“可...性”**：单元测试消除了修改代码的恐惧。只有拥有高覆盖率的测试，你才能放心地重构、改进架构（可维护性、灵活性）。
4.  **整洁测试的要素**：首要要素是**可读性**。使用“构造-操作-检查”（Build-Operate-Check）模式，并将细节封装在辅助函数中。
5.  **双重标准**：测试代码应当简单、精炼、富有表现力，但在效率（内存/CPU）要求上可以比生产代码宽松。
6.  **每个测试一个概念**：尽量遵守每个测试函数只包含一个断言（Assert）的准则，或者更准确地说，每个测试函数只测试一个**概念**。
7.  **F.I.R.S.T. 原则**：
    *   **F**ast（快速）：测试运行要快。
    *   **I**ndependent（独立）：测试之间不应相互依赖。
    *   **R**epeatable（可重复）：可在任何环境重复运行。
    *   **S**elf-Validating（自我验证）：输出应为布尔值（Pass/Fail）。
    *   **T**imely（及时）：测试应在生产代码之前编写。

---

## 翻译内容 (Translation)

# 第 9 章 Unit Tests
# 第 9 章 单元测试

![](figures/ch9/9_1fig_martin.jpg)

Our profession has come a long way in the last ten years. In 1997 no one had heard of Test Driven Development. For the vast majority of us, unit tests were short bits of throw-away code that we wrote to make sure our programs “worked.” We would painstakingly write our classes and methods, and then we would concoct some ad hoc code to test them. Typically this would involve some kind of simple driver program that would allow us to manually interact with the program we had written.

在过去十年里，我们的行业取得了长足的进步。1997 年时，没人听说过测试驱动开发（Test Driven Development）。对于我们绝大多数人来说，单元测试只是为了确保程序“能跑”而写的一小段一次性代码。我们会费尽心思编写类和方法，然后炮制一些临时代码来测试它们。通常，这涉及某种简单的驱动程序，允许我们手动与编写的程序进行交互。

I remember writing a C++ program for an embedded real-time system back in the mid-90s. The program was a simple timer with the following signature:
```cpp
   void Timer::ScheduleCommand(Command* theCommand, int milliseconds)
```
The idea was simple; the execute method of the Command would be executed in a new thread after the specified number of milliseconds. The problem was, how to test it.

记得 90 年代中期，我曾为某个嵌入式实时系统编写过一个 C++ 程序。那是个简单的定时器，签名如下：
```cpp
   void Timer::ScheduleCommand(Command* theCommand, int milliseconds)
```
思路很简单：Command 的 execute 方法将在指定的毫秒数之后在一个新线程中被执行。问题在于，如何测试它？

I cobbled together a simple driver program that listened to the keyboard. Every time a character was typed, it would schedule a command that would type the same character five seconds later. Then I tapped out a rhythmic melody on the keyboard and waited for that melody to replay on the screen five seconds later.

我拼凑了一个简单的驱动程序来监听键盘。每当输入一个字符，它就会安排一个命令，在 5 秒后输出同样的字符。然后我在键盘上敲出一段富有节奏的旋律，等着那段旋律 5 秒后在屏幕上重播。

“I … want-a-girl … just … like-the-girl-who-marr … ied … dear … old … dad.”

“I … want-a-girl … just … like-the-girl-who-marr … ied … dear … old … dad.”（歌词：我要个女孩，就像嫁给亲爱老爸的那个女孩。）

I actually sang that melody while typing the “.” key, and then I sang it again as the dots appeared on the screen.

我在敲击“.”键时真的唱着那段旋律，当点号出现在屏幕上时，我又唱了一遍。

That was my test! Once I saw it work and demonstrated it to my colleagues, I threw the test code away.

那就是我的测试！一旦看到它能工作并向同事演示完毕，我就把那段测试代码扔掉了。

As I said, our profession has come a long way. Nowadays I would write a test that made sure that every nook and cranny of that code worked as I expected it to. I would isolate my code from the operating system rather than just calling the standard timing functions. I would mock out those timing functions so that I had absolute control over the time. I would schedule commands that set boolean flags, and then I would step the time forward, watching those flags and ensuring that they went from false to true just as I changed the time to the right value.

如前所述，我们的行业已经进步了许多。如今，我会写一个测试，确保代码的每一个角落和缝隙都按预期工作。我会将代码与操作系统隔离，而不是直接调用标准的计时函数。我会模拟（mock）那些计时函数，以便完全控制时间。我会安排一些设置布尔标记的命令，然后将时间向前推进，观察这些标记，确保当我把时间变更为正确的值时，它们从 false 变为 true。

Once I got a suite of tests to pass, I would make sure that those tests were convenient to run for anyone else who needed to work with the code. I would ensure that the tests and the code were checked in together into the same source package.

一旦我有了一套通过的测试，我会确保其他需要使用这段代码的人也能方便地运行这些测试。我会确保测试代码和生产代码一起提交到同一个源码包中。

Yes, we’ve come a long way; but we have farther to go. The Agile and TDD movements have encouraged many programmers to write automated unit tests, and more are joining their ranks every day. But in the mad rush to add testing to our discipline, many programmers have missed some of the more subtle, and important, points of writing good tests.

是的，我们已经走了很远，但还有很长的路要走。敏捷（Agile）和 TDD 运动鼓励许多程序员编写自动化单元测试，每天都有更多人加入这一行列。但在急于将测试纳入我们规程的狂热中，许多程序员忽略了编写优秀测试的一些更微妙且重要的要点。

### THE THREE LAWS OF TDD
### TDD 三大定律

By now everyone knows that TDD asks us to write unit tests first, before we write production code. But that rule is just the tip of the iceberg. Consider the following three laws:1

现在大家都知道 TDD 要求我们在编写生产代码之前先写单元测试。但这条规则只是冰山一角。请考虑以下三条定律：

1. Professionalism and Test-Driven Development, Robert C. Martin, Object Mentor, IEEE Software, May/June 2007 (Vol. 24, No. 3) pp. 32–36
http://doi.ieeecomputersociety.org/10.1109/MS.2007.85

**First Law** You may not write production code until you have written a failing unit test.

**定律一** 在编写一个失败的单元测试之前，你不可编写生产代码。

**Second Law** You may not write more of a unit test than is sufficient to fail, and not compiling is failing.

**定律二** 你不可编写多于刚好能让测试失败的单元测试代码，编译不通过也算失败。

**Third Law** You may not write more production code than is sufficient to pass the currently failing test.

**定律三** 你不可编写多于刚好能让当前失败测试通过的生产代码。

These three laws lock you into a cycle that is perhaps thirty seconds long. The tests and the production code are written together, with the tests just a few seconds ahead of the production code.

这三条定律将你锁定在一个大约 30 秒的循环中。测试代码和生产代码是一起编写的，测试代码只比生产代码早几秒钟。

If we work this way, we will write dozens of tests every day, hundreds of tests every month, and thousands of tests every year. If we work this way, those tests will cover virtually all of our production code. The sheer bulk of those tests, which can rival the size of the production code itself, can present a daunting management problem.

如果我们按这种方式工作，我们要每天写几十个测试，每月写几百个，每年写几千个。按这种方式工作，那些测试将覆盖几乎所有的生产代码。这庞大的测试量——其规模堪比生产代码本身——会带来令人生畏的管理问题。

### KEEPING TESTS CLEAN
### 保持测试整洁

Some years back I was asked to coach a team who had explicitly decided that their test code should not be maintained to the same standards of quality as their production code. They gave each other license to break the rules in their unit tests. “Quick and dirty” was the watchword. Their variables did not have to be well named, their test functions did not need to be short and descriptive. Their test code did not need to be well designed and thoughtfully partitioned. So long as the test code worked, and so long as it covered the production code, it was good enough.

几年前，我受邀指导一个团队，他们明确决定：测试代码不需要保持与生产代码相同的质量标准。他们允许彼此在单元测试中打破规则。“又快又脏（Quick and dirty）”是他们的口号。变量名不必讲究，测试函数不必短小且具有描述性。测试代码不需要精心设计和划分。只要测试代码能跑，只要它覆盖了生产代码，那就足够了。

Some of you reading this might sympathize with that decision. Perhaps, long in the past, you wrote tests of the kind that I wrote for that Timer class. It’s a huge step from writing that kind of throw-away test, to writing a suite of automated unit tests. So, like the team I was coaching, you might decide that having dirty tests is better than having no tests.

正在阅读本书的某些人可能会赞同这个决定。也许很久以前，你写过像我为 Timer 类写的那种测试。从写那种一次性测试到写一套自动化单元测试，是一次巨大的跨越。所以，就像我指导的那个团队一样，你可能会觉得，有脏的测试总比没有测试好。

What this team did not realize was that having dirty tests is equivalent to, if not worse than, having no tests. The problem is that tests must change as the production code evolves. The dirtier the tests, the harder they are to change. The more tangled the test code, the more likely it is that you will spend more time cramming new tests into the suite than it takes to write the new production code. As you modify the production code, old tests start to fail, and the mess in the test code makes it hard to get those tests to pass again. So the tests become viewed as an ever-increasing liability.

这个团队没有意识到的是，拥有脏测试等同于（如果不是更糟的话）没有测试。问题在于，测试必须随着生产代码的演进而变更。测试越脏，就越难修改。测试代码越纠结，你花在将新测试塞进测试套件的时间，可能比编写新生产代码的时间还要长。当你修改生产代码时，旧的测试开始失败，而测试代码中的混乱让你很难让它们重新通过。因此，测试开始被视为一种不断增加的负担。

From release to release the cost of maintaining my team’s test suite rose. Eventually it became the single biggest complaint among the developers. When managers asked why their estimates were getting so large, the developers blamed the tests. In the end they were forced to discard the test suite entirely.

随着一个又一个版本的发布，维护团队测试套件的成本不断上升。最终，它成了开发者们最大的抱怨来源。当经理问为什么估算的时间变得这么长时，开发者们归咎于测试。最终，他们被迫彻底丢弃了测试套件。

But, without a test suite they lost the ability to make sure that changes to their code base worked as expected. Without a test suite they could not ensure that changes to one part of their system did not break other parts of their system. So their defect rate began to rise. As the number of unintended defects rose, they started to fear making changes. They stopped cleaning their production code because they feared the changes would do more harm than good. Their production code began to rot. In the end they were left with no tests, tangled and bug-riddled production code, frustrated customers, and the feeling that their testing effort had failed them.

但是，没有了测试套件，他们就失去了确保代码库变更按预期工作的能力。没有了测试套件，他们无法确保系统一部分的修改不会破坏其他部分。于是，缺陷率开始上升。随着意外缺陷数量的增加，他们开始害怕修改代码。他们停止清理生产代码，因为担心修改会弊大于利。他们的生产代码开始腐烂。最终，他们既没有测试，只剩下纠结且Bug缠身的生产代码、沮丧的客户，以及一种测试工作辜负了他们的感觉。

In a way they were right. Their testing effort had failed them. But it was their decision to allow the tests to be messy that was the seed of that failure. Had they kept their tests clean, their testing effort would not have failed. I can say this with some certainty because I have participated in, and coached, many teams who have been successful with clean unit tests.

在某种程度上，他们是对的。他们的测试工作确实辜负了他们。但这失败的种子是他们允许测试代码混乱的决定种下的。如果他们保持测试整洁，测试工作就不会失败。我可以肯定地说这一点，因为我参与并指导过许多通过整洁单元测试取得成功的团队。

The moral of the story is simple: Test code is just as important as production code. It is not a second-class citizen. It requires thought, design, and care. It must be kept as clean as production code.

这个故事的寓意很简单：**测试代码和生产代码一样重要**。它不是二等公民。它需要思考、设计和照料。它必须像生产代码一样保持整洁。

#### Tests Enable the -ilities
#### 测试带来“可...性”

If you don’t keep your tests clean, you will lose them. And without them, you lose the very thing that keeps your production code flexible. Yes, you read that correctly. It is unit tests that keep our code flexible, maintainable, and reusable. The reason is simple. If you have tests, you do not fear making changes to the code! Without tests every change is a possible bug. No matter how flexible your architecture is, no matter how nicely partitioned your design, without tests you will be reluctant to make changes because of the fear that you will introduce undetected bugs.

如果你不保持测试整洁，你就会失去它们。而没有了它们，你就失去了让生产代码保持灵活性的东西。是的，你没看错。正是单元测试让我们的代码保持**可**灵活、**可**维护和**可**重用。原因很简单。如果你有测试，你就不怕修改代码！没有测试，每次修改都可能是个 Bug。无论你的架构多灵活，无论你的设计划分得多好，如果没有测试，你就会因为害怕引入未被察觉的 Bug 而不愿意做修改。

But with tests that fear virtually disappears. The higher your test coverage, the less your fear. You can make changes with near impunity to code that has a less than stellar architecture and a tangled and opaque design. Indeed, you can improve that architecture and design without fear!

但有了测试，这种恐惧几乎消失了。测试覆盖率越高，你的恐惧就越少。你可以几乎不受惩罚地修改那些架构糟糕、设计纠结且不透明的代码。实际上，你可以无所畏惧地改进架构和设计！

So having an automated suite of unit tests that cover the production code is the key to keeping your design and architecture as clean as possible. Tests enable all the -ilities, because tests enable change.

因此，拥有一套覆盖生产代码的自动化单元测试，是保持设计和架构尽可能整洁的关键。测试带来了所有的“可...性”，因为测试使得变更成为可能。

So if your tests are dirty, then your ability to change your code is hampered, and you begin to lose the ability to improve the structure of that code. The dirtier your tests, the dirtier your code becomes. Eventually you lose the tests, and your code rots.

所以，如果你的测试很脏，你修改代码的能力就会受到阻碍，你将开始失去改进代码结构的能力。测试越脏，你的代码就变得越脏。最终你失去了测试，你的代码也就腐烂了。

### CLEAN TESTS
### 整洁的测试

What makes a clean test? Three things. Readability, readability, and readability. Readability is perhaps even more important in unit tests than it is in production code. What makes tests readable? The same thing that makes all code readable: clarity, simplicity, and density of expression. In a test you want to say a lot with as few expressions as possible.

怎样才算整洁的测试？三件事：**可读性，可读性，还是可读性**。在单元测试中，可读性甚至比在生产代码中更重要。什么让测试具有可读性？和让所有代码具有可读性的要素一样：清晰、简洁和表达密度。在测试中，你要用尽可能少的表达式来说明很多事情。

Consider the code from FitNesse in Listing 9-1. These three tests are difficult to understand and can certainly be improved. First, there is a terrible amount of duplicate code [G5] in the repeated calls to addPage and assertSubString. More importantly, this code is just loaded with details that interfere with the expressiveness of the test.

看看代码清单 9-1 中来自 FitNesse 的代码。这三个测试很难理解，肯定有改进空间。首先，在重复调用 `addPage` 和 `assertSubString` 中存在可怕的代码重复 [G5]。更重要的是，这段代码充斥着干扰测试表达力的细节。

**Listing 9-1 SerializedPageResponderTest.java**
```java
   public void testGetPageHieratchyAsXml() throws Exception
   {

     crawler.addPage(root, PathParser.parse(“PageOne”));
     crawler.addPage(root, PathParser.parse(“PageOne.ChildOne”));
     crawler.addPage(root, PathParser.parse(“PageTwo”));
 
     request.setResource(“root”);
     request.addInput(“type”, “pages”);
     Responder responder = new SerializedPageResponder();
     SimpleResponse response =
       (SimpleResponse) responder.makeResponse(
          new FitNesseContext(root), request);
     String xml = response.getContent();
 
     assertEquals(“text/xml”, response.getContentType());
     assertSubString(“<name>PageOne</name>”, xml);
     assertSubString(“<name>PageTwo</name>”, xml);
     assertSubString(“<name>ChildOne</name>”, xml);
   }
   public void testGetPageHieratchyAsXmlDoesntContainSymbolicLinks()
   throws Exception {
 
     WikiPage pageOne = crawler.addPage(root, PathParser.parse(“PageOne”));
     crawler.addPage(root, PathParser.parse(“PageOne.ChildOne”));
     crawler.addPage(root, PathParser.parse(“PageTwo”));
 
     PageData data = pageOne.getData();
     WikiPageProperties properties = data.getProperties();
     WikiPageProperty symLinks = properties.set(SymbolicPage.PROPERTY_NAME);
     symLinks.set(“SymPage”, ”PageTwo”);
     pageOne.commit(data);
 
     request.setResource(“root”);
     request.addInput(“type”, ”pages”);
     Responder responder = new SerializedPageResponder();
     SimpleResponse response =
       (SimpleResponse) responder.makeResponse(
          new FitNesseContext(root), request);
     String xml = response.getContent();
 
     assertEquals(“text/xml”, response.getContentType());
     assertSubString(“<name>PageOne</name>”, xml);
     assertSubString(“<name>PageTwo</name>”, xml);
     assertSubString(“<name>ChildOne</name>”, xml);
     assertNotSubString(“SymPage”, xml);
   }
 
   public void testGetDataAsHtml() throws Exception
   {
     crawler.addPage(root, PathParser.parse(“TestPageOne”), ”test page”);
 
     request.setResource(“TestPageOne”);
     request.addInput(“type”, ”data”); 
     Responder responder = new SerializedPageResponder();
     SimpleResponse response =
       (SimpleResponse) responder.makeResponse(
          new FitNesseContext(root), request);
     String xml = response.getContent();
 
     assertEquals(“text/xml”, response.getContentType());
     assertSubString(“test page”, xml);
     assertSubString(“<Test”, xml);
   }
```

For example, look at the PathParser calls. They transform strings into PagePath instances used by the crawlers. This transformation is completely irrelevant to the test at hand and serves only to obfuscate the intent. The details surrounding the creation of the responder and the gathering and casting of the response are also just noise. Then there’s the ham-handed way that the request URL is built from a resource and an argument. (I helped write this code, so I feel free to roundly criticize it.)

例如，看看 `PathParser` 的调用。它们将字符串转换为爬虫（crawler）使用的 `PagePath` 实例。这种转换与当下的测试完全无关，只会混淆意图。围绕着创建响应器（responder）以及收集和转换响应（response）的细节也只是噪音。还有那个笨拙的从资源和参数构建请求 URL 的方式。（这段代码也有我写的份，所以我可以随意批评它。）

In the end, this code was not designed to be read. The poor reader is inundated with a swarm of details that must be understood before the tests make any real sense.

说到底，这段代码不是为了让人读而设计的。可怜的读者在测试显露出任何实际意义之前，就被淹没在必须理解的一堆细节中了。

Now consider the improved tests in Listing 9-2. These tests do the exact same thing, but they have been refactored into a much cleaner and more explanatory form.

现在看看代码清单 9-2 中改进后的测试。这些测试做的事情完全一样，但已经重构成了更整洁、更具解释性的形式。

**Listing 9-2 SerializedPageResponderTest.java (refactored)**
```java
   public void testGetPageHierarchyAsXml() throws Exception {
     makePages(“PageOne”, “PageOne.ChildOne”, “PageTwo”);
 
     submitRequest(“root”, “type:pages”);
 
     assertResponseIsXML();
     assertResponseContains(
       “<name>PageOne</name>”, “<name>PageTwo</name>”, “<name>ChildOne</name>”
     );
   }
 
   public void testSymbolicLinksAreNotInXmlPageHierarchy() throws Exception {
     WikiPage page = makePage(“PageOne”);
     makePages(“PageOne.ChildOne”, “PageTwo”);
 
     addLinkTo(page, “PageTwo”, “SymPage”);
 
     submitRequest(“root”, “type:pages”);
 
     assertResponseIsXML();
     assertResponseContains(
       “<name>PageOne</name>”, “<name>PageTwo</name>”,
              “<name>ChildOne</name>”
     );
     assertResponseDoesNotContain(“SymPage”);
   } 
 
   public void testGetDataAsXml() throws Exception {
     makePageWithContent(“TestPageOne”, “test page”);
 
     submitRequest(“TestPageOne”, “type:data”);
 
     assertResponseIsXML();
     assertResponseContains(“test page”, “<Test”);
   }
```

The BUILD-OPERATE-CHECK2 pattern is made obvious by the structure of these tests. Each of the tests is clearly split into three parts. The first part builds up the test data, the second part operates on that test data, and the third part checks that the operation yielded the expected results.

“**构造-操作-检查**（BUILD-OPERATE-CHECK）”模式在这些测试的结构中显而易见。每个测试都清晰地分为三个部分。第一部分构造测试数据，第二部分操作这些测试数据，第三部分检查操作是否产生了预期的结果。

2. http://fitnesse.org/FitNesse.AcceptanceTestPatterns

Notice that the vast majority of annoying detail has been eliminated. The tests get right to the point and use only the data types and functions that they truly need. Anyone who reads these tests should be able to work out what they do very quickly, without being misled or overwhelmed by details.

请注意，绝大多数恼人的细节都被消除了。测试直奔主题，只使用真正需要的数据类型和函数。任何阅读这些测试的人都应该能很快弄清楚它们在做什么，而不会被误导或被细节淹没。

#### Domain-Specific Testing Language
#### 领域特定测试语言

The tests in Listing 9-2 demonstrate the technique of building a domain-specific language for your tests. Rather than using the APIs that programmers use to manipulate the system, we build up a set of functions and utilities that make use of those APIs and that make the tests more convenient to write and easier to read. These functions and utilities become a specialized API used by the tests. They are a testing language that programmers use to help themselves to write their tests and to help those who must read those tests later on.

代码清单 9-2 中的测试展示了为测试构建**领域特定语言**（DSL）的技术。我们不直接使用程序员用来操作系统的 API，而是构建一组利用这些 API 的函数和工具，使测试编写起来更方便，读起来更轻松。这些函数和工具变成了测试专用的 API。它们是一种测试语言，程序员用它来帮助自己编写测试，并帮助后来必须阅读这些测试的人。

This testing API is not designed up front; rather it evolves from the continued refactoring of test code that has gotten too tainted by obfuscating detail. Just as you saw me refactor Listing 9-1 into Listing 9-2, so too will disciplined developers refactor their test code into more succinct and expressive forms.

这种测试 API 并不是预先设计好的；相反，它是从那些因细节混淆而变得污秽的测试代码的持续重构中演化而来的。就像你看到我将代码清单 9-1 重构成代码清单 9-2 一样，自律的开发者也会将他们的测试代码重构成更简洁、更具表现力的形式。

#### A Dual Standard
#### 双重标准

In one sense the team I mentioned at the beginning of this chapter had things right. The code within the testing API does have a different set of engineering standards than production code. It must still be simple, succinct, and expressive, but it need not be as efficient as production code. After all, it runs in a test environment, not a production environment, and those two environment have very different needs.

从某种意义上说，我在本章开头提到的那个团队有一点是对的。测试 API 中的代码确实有着与生产代码不同的一套工程标准。它仍然必须简单、精炼且具有表现力，但它不必像生产代码那样高效。毕竟，它是在测试环境中运行，而不是生产环境，这两个环境有着截然不同的需求。

Consider the test in Listing 9-3. I wrote this test as part of an environment control system I was prototyping. Without going into the details you can tell that this test checks that the low temperature alarm, the heater, and the blower are all turned on when the temperature is “way too cold.”

看看代码清单 9-3 中的测试。这是我为当时正在做原型的一个环境控制系统写的测试。不用深究细节，你也能看出这个测试在检查：当温度“太冷（way too cold）”时，低温警报、加热器和鼓风机是否都已开启。

**Listing 9-3 EnvironmentControllerTest.java**
```java
   @Test
     public void turnOnLoTempAlarmAtThreashold() throws Exception {
       hw.setTemp(WAY_TOO_COLD);
       controller.tic();
       assertTrue(hw.heaterState());
       assertTrue(hw.blowerState());
       assertFalse(hw.coolerState());
       assertFalse(hw.hiTempAlarm());
       assertTrue(hw.loTempAlarm());
     }
```

There are, of course, lots of details here. For example, what is that tic function all about? In fact, I’d rather you not worry about that while reading this test. I’d rather you just worry about whether you agree that the end state of the system is consistent with the temperature being “way too cold.”

当然，这里有很多细节。例如，那个 `tic` 函数是干什么的？事实上，我不希望你在阅读这个测试时操心那个。我更希望你只关心系统的最终状态是否与温度“太冷”的情况一致。

Notice, as you read the test, that your eye needs to bounce back and forth between the name of the state being checked, and the sense of the state being checked. You see heaterState, and then your eyes glissade left to assertTrue. You see coolerState and your eyes must track left to assertFalse. This is tedious and unreliable. It makes the test hard to read.

注意，当你阅读这个测试时，你的视线需要在被检查的状态名称和被检查状态的含义之间来回跳跃。你看到 `heaterState`，然后你的眼睛滑向左边的 `assertTrue`。你看到 `coolerState`，然后你的眼睛必须追踪到左边的 `assertFalse`。这既乏味又不可靠，让测试变得难以阅读。

I improved the reading of this test greatly by transforming it into Listing 9-4.

通过将其转换为代码清单 9-4，我极大地提高了这个测试的可读性。

**Listing 9-4 EnvironmentControllerTest.java (refactored)**
```java
   @Test
     public void turnOnLoTempAlarmAtThreshold() throws Exception {
       wayTooCold();
       assertEquals(“HBchL”, hw.getState());
     }
```

Of course I hid the detail of the tic function by creating a wayTooCold function. But the thing to note is the strange string in the assertEquals. Upper case means “on,” lower case means “off,” and the letters are always in the following order: {heater, blower, cooler, hi-temp-alarm, lo-temp-alarm}.

当然，我通过创建一个 `wayTooCold` 函数隐藏了 `tic` 函数的细节。但要注意的是 `assertEquals` 中那个奇怪的字符串。大写表示“开启”，小写表示“关闭”，字母总是按以下顺序排列：{加热器, 鼓风机, 冷却器, 高温警报, 低温警报}。

Even though this is close to a violation of the rule about mental mapping,3 it seems appropriate in this case. Notice, once you know the meaning, your eyes glide across that string and you can quickly interpret the results. Reading the test becomes almost a pleasure. Just take a look at Listing 9-5 and see how easy it is to understand these tests.

尽管这接近于违反关于思维映射（mental mapping）的规则3，但在这种情况下似乎是恰当的。注意，一旦你明白了含义，你的目光滑过那个字符串，就能迅速解读结果。阅读测试几乎变成了一种享受。只需看看代码清单 9-5，看看理解这些测试有多容易。

3. “Avoid Mental Mapping” on page 25.

**Listing 9-5 EnvironmentControllerTest.java (bigger selection)**
```java
   @Test
   public void turnOnCoolerAndBlowerIfTooHot() throws Exception {
     tooHot();
     assertEquals(“hBChl”, hw.getState());
   }
 
   @Test
   public void turnOnHeaterAndBlowerIfTooCold() throws Exception {
     tooCold();
     assertEquals(“HBchl”, hw.getState());
   }
 
   @Test
   public void turnOnHiTempAlarmAtThreshold() throws Exception {
     wayTooHot();
     assertEquals(“hBCHl”, hw.getState());
   }
   @Test
   public void turnOnLoTempAlarmAtThreshold() throws Exception {
     wayTooCold();
     assertEquals(“HBchL”, hw.getState());
   }
```

The getState function is shown in Listing 9-6. Notice that this is not very efficient code. To make it efficient, I probably should have used a StringBuffer.

`getState` 函数如代码清单 9-6 所示。注意，这段代码效率不是很高。为了提高效率，我可能应该使用 `StringBuffer`。

**Listing 9-6 MockControlHardware.java**
```java
   public String getState() {
     String state = ””;
     state += heater ? “H” : “h”;
     state += blower ? “B” : “b”;
     state += cooler ? “C” : “c”;
     state += hiTempAlarm ? “H” : “h”;
     state += loTempAlarm ? “L” : “l”;
     return state;
   }
```

StringBuffers are a bit ugly. Even in production code I will avoid them if the cost is small; and you could argue that the cost of the code in Listing 9-6 is very small. However, this application is clearly an embedded real-time system, and it is likely that computer and memory resources are very constrained. The test environment, however, is not likely to be constrained at all.

`StringBuffer` 有点丑陋。即使在生产代码中，如果成本很小，我也会避免使用它们；你可以争辩说代码清单 9-6 中的代码成本非常小。然而，这个应用程序显然是一个嵌入式实时系统，计算机和内存资源可能非常有限。但是，测试环境很可能根本没有这些限制。

That is the nature of the dual standard. There are things that you might never do in a production environment that are perfectly fine in a test environment. Usually they involve issues of memory or CPU efficiency. But they never involve issues of cleanliness.

这就是双重标准的本质。有些事情你可能永远不会在生产环境中做，但在测试环境中却完全没问题。通常这涉及内存或 CPU 效率的问题。但**绝不涉及整洁度的问题**。

### ONE ASSERT PER TEST
### 每个测试一个断言

There is a school of thought4 that says that every test function in a JUnit test should have one and only one assert statement. This rule may seem draconian, but the advantage can be seen in Listing 9-5. Those tests come to a single conclusion that is quick and easy to understand.

有一个流派4认为，JUnit 测试中的每个测试函数都应该有且只有一个断言语句。这条规则似乎很严苛，但其好处可以在代码清单 9-5 中看到。那些测试得出一个单一的结论，既快速又容易理解。

4. See Dave Astel’s blog entry: http://www.artima.com/weblogs/viewpost.jsp?thread=35578

But what about Listing 9-2? It seems unreasonable that we could somehow easily merge the assertion that the output is XML and that it contains certain substrings. However, we can break the test into two separate tests, each with its own particular assertion, as shown in Listing 9-7.

但是代码清单 9-2 呢？想要把“输出是 XML”和“包含特定子字符串”这两个断言轻易合并起来似乎不太合理。不过，我们可以把测试拆分成两个独立的测试，每个都有其特定的断言，如代码清单 9-7 所示。

**Listing 9-7 SerializedPageResponderTest.java (Single Assert)**
```java
   public void testGetPageHierarchyAsXml() throws Exception {
       givenPages(“PageOne”, “PageOne.ChildOne”, “PageTwo”);
 
       whenRequestIsIssued(“root”, “type:pages”);
 
       thenResponseShouldBeXML();
   }
   public void testGetPageHierarchyHasRightTags() throws Exception {
       givenPages(“PageOne”, “PageOne.ChildOne”, “PageTwo”);
 
       whenRequestIsIssued(“root”, “type:pages”);
 
       thenResponseShouldContain(
         “<name>PageOne</name>”, “<name>PageTwo</name>”, “<name>ChildOne</name>”
       );
   }
```

Notice that I have changed the names of the functions to use the common given-when-then5 convention. This makes the tests even easier to read. Unfortunately, splitting the tests as shown results in a lot of duplicate code.

注意，我把函数名改成了使用通用的 **given-when-then**（给定-当-那么）约定5。这使得测试读起来更容易。不幸的是，像这样拆分测试导致了大量的代码重复。

5. [RSpec].

We can eliminate the duplication by using the TEMPLATE METHOD6 pattern and putting the given/when parts in the base class, and the then parts in different derivatives. Or we could create a completely separate test class and put the given and when parts in the @Before function, and the when parts in each @Test function. But this seems like too much mechanism for such a minor issue. In the end, I prefer the multiple asserts in Listing 9-2.

我们可以通过使用模板方法（TEMPLATE METHOD）模式6，将 given/when 部分放在基类中，将 then 部分放在不同的派生类中，来消除重复。或者我们可以创建一个完全独立的测试类，将 given 和 when 部分放在 `@Before` 函数中，将 when 部分放在每个 `@Test` 函数中。但这对于这么小的问题来说，似乎机制太繁重了。最终，我还是更喜欢代码清单 9-2 中的多个断言。

6. [GOF].

I think the single assert rule is a good guideline.7 I usually try to create a domain-specific testing language that supports it, as in Listing 9-5. But I am not afraid to put more than one assert in a test. I think the best thing we can say is that the number of asserts in a test ought to be minimized.

我认为单一断言规则是一个很好的**指导方针**7。我通常尝试创建一个支持它的领域特定测试语言，如代码清单 9-5 所示。但我也不怕在一个测试中放入多个断言。我认为最好的说法是，测试中的断言数量应该尽量减少。

7. “Keep to the code!”

#### Single Concept per Test
#### 每个测试一个概念

Perhaps a better rule is that we want to test a single concept in each test function. We don’t want long test functions that go testing one miscellaneous thing after another. Listing 9-8 is an example of such a test. This test should be split up into three independent tests because it tests three independent things. Merging them all together into the same function forces the reader to figure out why each section is there and what is being tested by that section.

也许一个更好的规则是，我们希望在每个测试函数中测试**单一概念**。我们不想要那种冗长的、测试完一个杂项又测另一个杂项的测试函数。代码清单 9-8 就是这样一个例子。这个测试应该拆分成三个独立的测试，因为它测试了三件独立的事情。把它们合并到同一个函数中，迫使读者去弄清楚为什么每一部分会在那里，以及那一部分到底在测什么。

**Listing 9-8**
```java
   /**
   * Miscellaneous tests for the addMonths() method.
   */
   public void testAddMonths() {
       SerialDate d1 = SerialDate.createInstance(31, 5, 2004);
 
       SerialDate d2 = SerialDate.addMonths(1, d1);
       assertEquals(30, d2.getDayOfMonth());
       assertEquals(6, d2.getMonth());
       assertEquals(2004, d2.getYYYY());
 
       SerialDate d3 = SerialDate.addMonths(2, d1);
       assertEquals(31, d3.getDayOfMonth());
       assertEquals(7, d3.getMonth());
       assertEquals(2004, d3.getYYYY());
 
       SerialDate d4 = SerialDate.addMonths(1, SerialDate.addMonths(1, d1));
       assertEquals(30, d4.getDayOfMonth());
       assertEquals(7, d4.getMonth());
       assertEquals(2004, d4.getYYYY());
 
   }
```

The three test functions probably ought to be like this:

这三个测试函数大概应该是这样的：

- Given the last day of a month with 31 days (like May):
- 给定一个有 31 天的月份的最后一天（如 5 月）：

1. When you add one month, such that the last day of that month is the 30th (like June), then the date should be the 30th of that month, not the 31st.
1. 当你增加一个月，而该月的最后一天是 30 号（如 6 月），那么日期应该是该月的 30 号，而不是 31 号。

2. When you add two months to that date, such that the final month has 31 days, then the date should be the 31st.
2. 当你给该日期增加两个月，而最终的月份有 31 天，那么日期应该是 31 号。

- Given the last day of a month with 30 days in it (like June):
- 给定一个有 30 天的月份的最后一天（如 6 月）：

1. When you add one month such that the last day of that month has 31 days, then the date should be the 30th, not the 31st.
1. 当你增加一个月，而该月的最后一天有 31 天，那么日期应该是 30 号，而不是 31 号。

Stated like this, you can see that there is a general rule hiding amidst the miscellaneous tests. When you increment the month, the date can be no greater than the last day of the month. This implies that incrementing the month on February 28th should yield March 28th. That test is missing and would be a useful test to write.

像这样陈述，你可以看到隐藏在这些杂项测试中的一条通用规则。当你增加月份时，日期不能大于该月的最后一天。这意味着在 2 月 28 日增加一个月应该得到 3 月 28 日。那个测试缺失了，而且会是一个有用的测试。

So it’s not the multiple asserts in each section of Listing 9-8 that causes the problem. Rather it is the fact that there is more than one concept being tested. So probably the best rule is that you should minimize the number of asserts per concept and test just one concept per test function.

所以，导致问题的不是代码清单 9-8 各个部分中的多个断言，而是被测试的概念不止一个。所以最好的规则可能是：你应该尽量减少每个概念的断言数量，并且每个测试函数只测试一个概念。

### F.I.R.S.T.8
### F.I.R.S.T. 原则

8. Object Mentor Training Materials.

Clean tests follow five other rules that form the above acronym:

整洁的测试遵循构成上述缩写词的另外五条规则：

**Fast** Tests should be fast. They should run quickly. When tests run slow, you won’t want to run them frequently. If you don’t run them frequently, you won’t find problems early enough to fix them easily. You won’t feel as free to clean up the code. Eventually the code will begin to rot.

**快速（Fast）** 测试应该快。它们应该运行得很快。当测试运行缓慢时，你就不想频繁地运行它们。如果你不频繁运行它们，你就无法尽早发现问题以便轻松修复。你就不会觉得可以随意清理代码。最终代码将开始腐烂。

**Independent** Tests should not depend on each other. One test should not set up the conditions for the next test. You should be able to run each test independently and run the tests in any order you like. When tests depend on each other, then the first one to fail causes a cascade of downstream failures, making diagnosis difficult and hiding downstream defects.

**独立（Independent）** 测试不应该相互依赖。一个测试不应该为下一个测试设置条件。你应该能够独立运行每个测试，并以任何你喜欢的顺序运行测试。当测试相互依赖时，第一个失败的测试会导致下游的一连串失败，使得诊断变得困难，并隐藏了下游的缺陷。

**Repeatable** Tests should be repeatable in any environment. You should be able to run the tests in the production environment, in the QA environment, and on your laptop while riding home on the train without a network. If your tests aren’t repeatable in any environment, then you’ll always have an excuse for why they fail. You’ll also find yourself unable to run the tests when the environment isn’t available.

**可重复（Repeatable）** 测试应该在任何环境中都是可重复的。你应该能够在生产环境、QA 环境以及在没有网络的火车上回家的路上用笔记本电脑运行测试。如果你的测试不能在任何环境中重复，你总会有借口来解释它们为什么失败。你也发现在环境不可用时无法运行测试。

**Self-Validating** The tests should have a boolean output. Either they pass or fail. You should not have to read through a log file to tell whether the tests pass. You should not have to manually compare two different text files to see whether the tests pass. If the tests aren’t self-validating, then failure can become subjective and running the tests can require a long manual evaluation.

**自我验证（Self-Validating）** 测试应该有布尔输出。要么通过，要么失败。你不应该通过阅读日志文件来判断测试是否通过。你不应该需要手动对比两个不同的文本文件来查看测试是否通过。如果测试不是自我验证的，那么失败可能会变得主观，运行测试可能需要漫长的人工评估。

**Timely** The tests need to be written in a timely fashion. Unit tests should be written just before the production code that makes them pass. If you write tests after the production code, then you may find the production code to be hard to test. You may decide that some production code is too hard to test. You may not design the production code to be testable.

**及时（Timely）** 测试需要及时编写。单元测试应该恰好在使其通过的生产代码之前编写。如果你在生产代码之后编写测试，你可能会发现生产代码很难测试。你可能会决定某些生产代码太难测试而不测了。你可能不会将生产代码设计成可测试的。

### CONCLUSION
### 结论

We have barely scratched the surface of this topic. Indeed, I think an entire book could be written about clean tests. Tests are as important to the health of a project as the production code is. Perhaps they are even more important, because tests preserve and enhance the flexibility, maintainability, and reusability of the production code. So keep your tests constantly clean. Work to make them expressive and succinct. Invent testing APIs that act as domain-specific language that helps you write the tests.

我们仅仅触及了这个话题的皮毛。事实上，我认为关于整洁测试可以写整整一本书。测试对于项目的健康与生产代码一样重要。也许它们甚至更重要，因为测试保留并增强了生产代码的灵活性、可维护性和可重用性。所以，请始终保持你的测试整洁。努力让它们具有表现力和简洁。发明作为领域特定语言的测试 API 来帮助你编写测试。

If you let the tests rot, then your code will rot too. Keep your tests clean.

如果你让测试腐烂，那么你的代码也会腐烂。保持你的测试整洁。