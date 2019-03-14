---
title: "Usage"
date: 2019-03-13T22:12:12+01:00
draft: false
---

# CLI Usage

## Initializing

<pre>
<code class="bash">
$ Goca -h
  -domain string
    	Scrape domain
  -dorkpages int
    	Number of pages to dork form the search engine (default 1)
  -filetype string
    	Look for metadata on (default "*")
  -folder string
    	Run goca against local folder
  -listplugins
    	List available plugins
  -listurls
    	Just list url do not process them
  -loglevel string
    	Log level
  -term string
    	Dork term
  -timeout int
    	Timeout per request (default 30)
  -ua string
    	User-Agent to be used.
  -url string
    	Scope Goca acctions to a domain
</code>
</pre>


## Plugins

<pre>
<code class="bash">
$ Goca -listplugins
Plugins for: ppt
  - ppt

Plugins for: mp3
  - mp3

Plugins for: image
  - image

Plugins for: dsstore
  - dsstore

Plugins for: odp
  - odp

Plugins for: ods
  - ods

Plugins for: xls
  - xls

Plugins for: doc
  - doc

Plugins for: odt
  - odt

Plugins for: pdf
  - pdf
</code>
</pre>


## Debug level

By default it is disabled. You can set `loglevel` flag to `debug` and `info`:

`info` log level:

<pre>
<code class="bash">
$ Goca -url "google.com" -loglevel info
INFO[0000] Fear The Goca!
INFO[0000] Version: (dev) () built on
WARN[0000] Running Goca with all plugins
{
	"main_type": "PDF",
	"target": "https://research.google.com/pubs/archive/44268.pdf",
	"create_date": "2015-06-05T10:32:36-04:00",
	"modify_date": "2015-08-27T15:53:14+02:00",
	"metadata_date": "2015-08-27T15:53:14+02:00",
	"creator_tool": "Causal Productions Pty Ltd",
	"document_id": "uuid:812cbd70-5b7b-472c-be5c-f3c3d0cd2c19",
	"instance_id": "uuid:bcc79f57-f422-41af-a873-36fb75d00f84",
	"content_type": "application/pdf",
	"title": "Large Vocabulary Automatic Speech Recognition for Children",
	"producer": "pdfTeX-1.40.14"
}
</code>
</pre> 

`debug` log level:

<pre>
<code class="bash">
$ Goca -url "google.com" -loglevel debug
INFO[0000] Fear The Goca!
INFO[0000] Version: (dev) () built on
WARN[0000] Running Goca with all plugins
DEBU[0000] Dorks for plugin *: [{google site:google.com inurl:.DS_Store intitle:index.of} {google site:google.com intext:.DS_Store & intitle:index -github} {google site:google.com intitle:index.of +?last modified? +?parent directory? +(mp3|wma|ogg) -htm -html -php -asp} {google site:google.com filetype:mp3} {google site:google.com filetype:mp4} {google site:google.com filetype:m4a} {google site:google.com filetype:m4p} {google site:google.com filetype:m4v} {google site:google.com filetype:3gp} {google site:google.com filetype:3g2} {google site:google.com filetype:flac} {google site:google.com filetype:mp3} {google site:google.com filetype:mp4} {google site:google.com filetype:m4a} {google site:google.com filetype:m4p} {google site:google.com filetype:m4v} {google site:google.com filetype:3gp} {google site:google.com filetype:3g2} {google site:google.com filetype:mp3} {google site:google.com filetype:mp4} {google site:google.com filetype:m4a} {google site:google.com filetype:m4p} {google site:google.com filetype:m4v} {google site:google.com filetype:3gp} {google site:google.com filetype:3g2} {google site:google.com filetype:ogg} {google site:google.com filetype:ogv} {google site:google.com filetype:oga} {google site:google.com filetype:ogx}]
DEBU[0000] Executing plugin mp3
DEBU[0000] Executing plugin odp
DEBU[0000] Executing plugin pdf
DEBU[0000] Executing plugin ppt
DEBU[0000] Executing plugin dsstore
DEBU[0000] Executing plugin image
DEBU[0000] Executing plugin ods
DEBU[0000] Executing plugin odt
DEBU[0000] Executing plugin xls
DEBU[0000] Executing plugin doc
</code>
</pre>


## Looking for metadata in one site

To look metadata in just one site:

<pre>
<code class="bash">
Goca -url "google.com" -loglevel info
{
	"main_type": "PDF",
	"target": "https://research.google.com/pubs/archive/44268.pdf",
	"create_date": "2015-06-05T10:32:36-04:00",
	"modify_date": "2015-08-27T15:53:14+02:00",
	"metadata_date": "2015-08-27T15:53:14+02:00",
	"creator_tool": "Causal Productions Pty Ltd",
	"document_id": "uuid:812cbd70-5b7b-472c-be5c-f3c3d0cd2c19",
	"instance_id": "uuid:bcc79f57-f422-41af-a873-36fb75d00f84",
	"content_type": "application/pdf",
	"title": "Large Vocabulary Automatic Speech Recognition for Children",
	"producer": "pdfTeX-1.40.14"
}
</code>
</pre>

## Look for metadata from a specified term

<pre>
<code class="bash">
Goca -term "Chema Alonso"
{

}
</code>
</pre>

## Other options

It is possible also to specify which file type do you want to search:

<pre>
<code class="bash">
$ Goca -url google.com -filetype pdf
{
	"main_type": "PDF",
	"target": "https://research.google.com/pubs/archive/44268.pdf",
	"create_date": "2015-06-05T10:32:36-04:00",
	"modify_date": "2015-08-27T15:53:14+02:00",
	"metadata_date": "2015-08-27T15:53:14+02:00",
	"creator_tool": "Causal Productions Pty Ltd",
	"document_id": "uuid:812cbd70-5b7b-472c-be5c-f3c3d0cd2c19",
	"instance_id": "uuid:bcc79f57-f422-41af-a873-36fb75d00f84",
	"content_type": "application/pdf",
	"title": "Large Vocabulary Automatic Speech Recognition for Children",
	"producer": "pdfTeX-1.40.14"
}
{
	"main_type": "PDF",
	"target": "https://research.google.com/pubs/archive/43970.pdf",
	"create_date": "2015-06-10T14:20:35-07:00",
	"modify_date": "2015-08-27T15:52:42+02:00",
	"metadata_date": "2015-08-27T15:52:42+02:00",
	"creator_tool": "Causal Productions Pty Ltd",
	"document_id": "uuid:6bf36bef-41f2-40b3-be6b-91819f1aeb83",
	"instance_id": "uuid:035a66fd-f37b-449a-b346-a65504bd8434",
	"content_type": "application/pdf",
	"title": "Locally-Connected and Convolutional Neural Networks for Small Footprint Speaker Recognition",
	"producer": "pdfTeX-1.40.14"
}
</code>
</pre>

# GUI Usage

Coming soon :trollface: