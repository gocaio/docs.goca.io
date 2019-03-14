---
title: "Plugin System"
date: 2019-03-13T22:12:12+01:00
draft: false
---

# Plugin System

GOCA&copy; plugins are code snippets developed independetly from the GOCA&copy; core. Even so, plugins have to be linked to GOCA&copy; and have some kind of `dorker` or `crawler` associated.

The plugin system is a common way to import code from outside of the main package or program. This system is based in the way that Go import packages. This system allows plugin developers to call a register method in `init` function of each file/package.

## Registering a plugin

A plugin is a Golang package, just that. The package must import and call the `goca.RegisterPlugin` to register itself as plugin. For each plugin, a unique plugin name must be especified, it also needs a type, an associeted list of MIME type, an _EntryPoint_, and a matcher function.

<pre>
<code class="go">
goca.RegisterPlugin("audio", goca.Plugin{
    Type:   "mp3",
    Assoc:  []string{"audio/mpeg"},
    Action: setup,
    Matcher: matcherFunc,
})
</code>
</pre>

In this particular case, a plugin named `audio` is being definied. This plugin is defined using `goca.Plugin`.

Inside this structure, the type of plugin is defined (`mp3` in this case). The type will be used to call or initialize the plugin from the command line. This means you can have serveral plugins (with different names) associated to the same plugin type. Moreover, a MIMEType list is defined which are associated to this plugin. It is possible that a plugin can process more than one kind of MIMEType. The plugin entry point is especified in the `Action` field.

Finally, in case you develop a plugin for a wierd file type, you can define a file type matcher function. That function indicates to GOCA&copy; when a plugin must be fired and analyze its content.

## Plugin's communication

Communication between GOCA&copy; and Plugins works using events. Each plugin is receiving a controller where it can subscribe and publish events.

It is recommended to use a global object inside the plugins to keep the plugin alive and give the possibility to subscribe or publish events when necessary.

An example for mp3 plugin.

<pre>
<code class="go">
var mp3 *mp3MetaExtractor

type mp3MetaExtractor struct {
    goca.Manager
}
</code>
</pre>

### Entry point

Function defined as entry point should initialize the global object and assign the `goca.Manager` controller received as parameter. The entrypoint should satisfied `func(goca.Manager) error`.

From this point, the plugin will be subscribed to the events.

<pre>
<code class="go">
func setup(m goca.Manager) error {
    mp3 = new(mp3MetaExtractor)
    mp3.Manager = m
    mp3.Subscribe(goca.Topics["NewURL"], mp3.readMP3)
    return nil
}
</code>
</pre>

As you can imagine `mp3.readMP3` is where the magic happends.

### Emitting `goca.Output`

When plugins' work is done, it has to publish an event with the result. For that matter, it is necessary to emit or publish an event with the `goca.Output` object.

<pre>
<code class="go">
func (mp3 *mp3MetaExtractor) readMP3(url string, data []byte) {
    log.Debugf("[MP3] Received Data Length: %d - URL: %s\n", len(data), url)
    buf := bytes.NewReader(data)
    m, err := tag.ReadFrom(buf)
    if err == nil {
        out := goca.NewOutput()
        out.Title = m.Title()
        out.Album = m.Album()
        out.Artist = m.Artist()
        out.AlbumArtist = m.AlbumArtist()
        out.Comment = m.Comment()
        out.Composer = m.Composer()
        out.Disc.A, out.Disc.B = m.Disc()
        out.Genre = m.Genre()
        out.Lyrics = m.Lyrics()
        out.Track.A, out.Track.B = m.Track()

        mp3.Publish(goca.Topics["NewOutput"], plugName, url, out)
    } else {
        log.Errorf("[MP3] - Err: %s\n", err.Error())
    }
}
</code>
</pre>

## Goca integration

The integratios happens in the GOCA&copy;'s `plugins` package, inside the `plugins.go` file. In this file it is only necessary to import the new module.

<pre>
<code class="go">
package plugins

import (
    _ "github.com/gocaio/goca/plugins/mp3"
)
</code>
</pre>

If `goca.Object` does not satisfies the necessary fields to store the meta information extracted from the plugin, it is necessary to implement the required fields into `goca.Output` in a flatten way.

Finally, it is necessary to provide at least one dork for the MIMEType associated to the plugin. This is going to be in the `dorker` package, in the `dorker.go` file, where the `DorkLib` has to be updated with the required dorks.

<pre>
<code class="go">
var DorkLib = dorkLib{
    "application/pdf": []Dork{
        Dork{"google", "filetype:pdf +\"%s\""},
    },
    "audio/mpeg": []Dork{
        Dork{"google", "filetype:mp3 +\"%s\""},
    },
}
</code>
</pre>

## Plugin Testing
It is crucial that a plugin does what it is supposed to do so a test case is needed for avery plugin. A plugin test is a file inside plugin package that its name ends with `_test.go`. This kind of test files has access to all objects inside the plugin so you can test any internal stuff.

The test must simulate the way Goca&copy; sends data to the plugin. This is bassicaly subscribing the plugin test case to **NewOutput** event. We can achieve this behaviour by creating a test case in this way.

<pre>
<code class="go">
func TestReadDOC(t *testing.T) {
	T = t // Assignment t (*testing.T to a global T variable)
	// Get a controller
	ctrl := goca.NewControllerTest()
	// Subscribe a processOutput. The propper test will be placed in proccessOutput
	ctrl.Subscribe(goca.Topics["NewOutput"], processOutput)

	// Call the plugin entrypoint
	setup(ctrl)

	gocatesting.GetAssets(t, ctrl, testserver, plugName)
}
</code>
</pre>

In the previous example we define `T` (global \*testing.T) variable so testing object is availabe through the whole test. A new test controller is created by calling `goca.NewControllerTest()`. That controller allows us to subscribe and publish events. We need to subscribe the plugin test to the `NewOutput` event. To do a propper configuration the *setup* entrypoint have to be called.

Finally, `gocatesting.GetAssets` will fire `NewURL` event for assets used to run the test. `gocatesting` can be configured to use local server or remote one. That will be done internaly by running `make test` for remote testing or `make test-local` for local testing. To run a local test a local server must be executed. You can do that by issuing `go run gocaTesting/testServer/server.go -path gocaTesting/testData` before run `make test-local`.

Both server local and remote server will serve the files from a URI like this `/<plugName>/<fileTest>`, for example `/doc/Doc1.docx`. That means your `processOutput` have to handle that. An example of processOutput is:

<pre>
<code class="go">
func processOutput(module, url string, out *goca.Output) {
	// We have to validate goca.Output according to the resource
	parts := strings.Split(out.Target, "/")

	switch parts[len(parts)-1] {
	case "Doc1.docx":
		validateCaseA(out)
	case "Doc2.docx":
		validateCaseB(out)
	case "Doc3.docx":
		validateCaseC(out)
	}
}
</code>
</pre>

You must drop your test files in `gocaTesting/testData/<plugName>`.

Basicaly, each test file a validate o test case function is fired. There is where you must validate the expected output. An example from doc plugin.

<pre>
<code class="go">
func validateCaseA(out *goca.Output) {
	if out.MainType != "DOCX" {
		T.Errorf("expected DOCX but found %s", out.MainType)
	}
	if out.Title != "2018–2019 Statewide Testing Schedule and Administration Deadlines, January 18, 2019" {
		T.Errorf("expected \"2018–2019 Statewide Testing Schedule and Administration Deadlines, January 18, 2019\" but found %s", out.Title)
	}
	if out.Comment != "" {
		T.Errorf("expected \"\" but found %s", out.Comment)
	}
	if out.Producer != "DESE" {
		T.Errorf("expected \"DESE\" but found %s", out.Producer)
	}
	if out.Keywords != "" {
		T.Errorf("expected \"\" but found %s", out.Keywords)
	}
	if out.Description != "" {
		T.Errorf("expected \"\" but found %s", out.MainType)
	}
	if out.ModifiedBy != "Zou, Dong (EOE)" {
		T.Errorf("expected \"Zou, Dong (EOE)\" but found %s", out.ModifiedBy)
	}
	if out.DocumentID != "16" {
		T.Errorf("expected \"16\" but found %s", out.DocumentID)
	}
	if out.CreateDate != "2018-10-24T14:04:00Z" {
		T.Errorf("expected \"2018-10-24T14:04:00Z\" but found %s", out.CreateDate)
	}
	if out.ModifyDate != "2019-01-18T20:59:00Z" {
		T.Errorf("expected \"2019-01-18T20:59:00Z\" but found %s", out.ModifyDate)
	}
	if out.Category != "" {
		T.Errorf("expected \"\" but found %s", out.Category)
	}
}
</code>
</pre>