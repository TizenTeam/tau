<header>
	<h1>Widget: [MyWidget]</h1>
</header>

<section id="Overview">
	<header>
		<h1>Overview</h1>
	</header>
	<article>
[Write a description of MyWidget here.]
	</article>
</section>

<section id="Dependencies">
	<header>
		<h1>Dependencies</h1>
	</header>
	<article>
[Write list of dependent widgets here. If there is no dependency, write "No dependency."]
	</article>
</section>

<section id="Example">
	<header>
		<h1>Example</h1>
	</header>
	<article>
	<div class="code-exam">
		<pre><code>
[Write typical example code here.]
		</code></pre>
	</div>
	</article>
</section>

<section id="Options">
	<header>
		<h1>Options</h1>
	</header>
	<article>
		<header>
			<h1 class="title">[Option name]</h1>
			<span class="type">Type: [Data type: String, Number, Boolean, ...]</span>
			<span class="default">Default: [Default value]</span>
		</header>
		<p>[Write a description of the option here. ONE article per ONE option!]</p>
		<div class="code-exam">
		<h3>Code examples</h3>
			<dl>
				<dt>
					[Example code description here]
				</dt>
				<dd>
					<pre><code>
[Code here]
					</code></pre>
				</dd>
			</dl>
		</div>
	</article>
</section>

<section id="Sub-elements">
	<header>
		<h1>Sub-elements</h1>
	</header>
	<article>
[Write sub elements here. ONE aritcle per ONE sub-element. If sub element is not needed, write "No sub-element is needed."]
	</article>
</section>

<section id="Events">
	<header>
		<h1>Events</h1>
	</header>
	<article>
		<header>
			<h1 class="title">[Event name]</h1>
		</header>
		<p>[Description of this event here.]</p>
		<div class="code-exam">
			<h3>Code examples</h3>
			<dl>
				<dt>[Description of this code example here.]</dt>
				<dd>
					<pre><code>
[Code here]
					</code></pre>
					<pre><code>
[Code here]
					</code></pre>
				</dd>
			</dl>
		</div>
	</article>
</section>

<section id="Methods">
	<header>
		<h1>Methods</h1>
	</header>
	<article>
		<header>
			<h1 class="title">destroy</h1>
		</header>
		<dl>
			<dt>Signature</dt>
			<dd>.[factory method]( "destroy" )</dd>
		</dl>
		<p>Remove widget functionality completely. This will return the element back to its pre-init state.</p>
	</article>
	<article>
		<header>
			<h1 class="title">option</h1>
		</header>
		<dl>
			<dt>Signature</dt>
			<dd>.[factory method]( "option", optionName [, value] )</dd>
		</dl>
		<p>Get or set any widget option. If value is not given, this will act as a getter function.</p>
		<dl>
			<dt>Signature</dt>
			<dd>.[factory method]( "option", options )</dd>
		</dl>
		<p>Set multipel widget options at once, by providing an options object.</p>
	</article>
	<article>
		<header>
			<h1 class="title">refresh</h1>
		</header>
		<dl>
			<dt>Signature</dt>
			<dd>.[factory method]( "refresh" )</dd>
		</dl>
		<p>Refreshes the widget. This method is useful for updaating widget's visual state, when the widget's state is changed by javascript code.</p>
	</article>

	<article>
		<header>
			<h1 class="title">[method name]</h1>
		</header>
		<dl>
			<dt>Signature</dt>
			<dd>[method signature]</dd>
		</dl>
		<p>[method description</p>
		<div class="code-exam">
			<h3>Code examples</h3>
			<dl>
				<dt>[Code description]</dt>
				<dd>
					<pre><code>
[Code(html?) here]
					</code></pre>
					<pre><code>
[Code(javascript?) here]
					</code></pre>
				</dd>
			</dl>
		</div>
	</article>

</section>

<section id="Theming">
</section>

