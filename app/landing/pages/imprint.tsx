import React from "react"
import { Section } from "app/core/components"
import { Navbar } from "../components/navbar"
import { BlitzPage } from "@blitzjs/core"

export const Imprint: BlitzPage = () => {
  return (
    <div>
      <div className="pt-16 -mt-16 bg-gray-50 ">
        <div className="fixed inset-x-0 top-0 z-20 bg-gray-50">
          <Navbar />
        </div>
        <Section className="mx-auto prose-sm prose sm:prose lg:prose-lg xl:prose-xl">
          <span className="text-sm ">German only</span>
          <h1>Imprint / Impressum</h1>
          <h2>Angaben gemäß § 5 TMG</h2>
          <span>
            Jordt Kohler Mackintosh Meister Meister Thomas Webersinke GbR
          </span>
          <br></br>
          <span>Treibberg 9</span>
          <br></br>
          <span>90403 Nürnberg</span>
          <h2>Vertreten durch:</h2>
          <div className="flex flex-col">
            <span>Mads Jordt</span>
            <span>Kevin Kohler</span>
            <span>Lauren Mackintosh</span>
            <span>Luis Meister</span>
            <span>Lukas Meister</span>
            <span>Andreas Thomas</span>
            <span>Nicolas Webersinke</span>
          </div>
          <h2>Kontakt</h2>
          <div className="flex flex-col">
            <span>Telefon: +49 (0) 160 155 1312</span>
            <span>E-Mail: info@perfol.io</span>
          </div>

          <h2> EU-Streitschlichtung</h2>
          <p>
            Die Europäische Kommission stellt eine Plattform zur
            Online-Streitbeilegung (OS) bereit:
            https://ec.europa.eu/consumers/odr. Unsere E-Mail-Adresse finden Sie
            oben im Impressum.
          </p>

          <h2>Verbraucherstreitbeilegung / Universalschlichtungsstelle</h2>
          <p>
            Wir sind nicht bereit oder verpflichtet, an
            Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle
            teilzunehmen.
          </p>

          <h2>Haftung für Inhalte</h2>
          <p>
            Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte
            auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach
            §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht
            verpflichtet, übermittelte oder gespeicherte fremde Informationen zu
            überwachen oder nach Umständen zu forschen, die auf eine
            rechtswidrige Tätigkeit hinweisen.
          </p>
          <p>
            Verpflichtungen zur Entfernung oder Sperrung der Nutzung von
            Informationen nach den allgemeinen Gesetzen bleiben hiervon
            unberührt. Eine diesbezügliche Haftung ist jedoch erst ab dem
            Zeitpunkt der Kenntnis einer konkreten Rechtsverletzung möglich. Bei
            Bekanntwerden von entsprechenden Rechtsverletzungen werden wir diese
            Inhalte umgehend entfernen.
          </p>
          <h2>Haftung für Links</h2>

          <p>
            Unser Angebot enthält Links zu externen Websites Dritter, auf deren
            Inhalte wir keinen Einfluss haben. Deshalb können wir für diese
            fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der
            verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber
            der Seiten verantwortlich. Die verlinkten Seiten wurden zum
            Zeitpunkt der Verlinkung auf mögliche Rechtsverstöße überprüft.
            Rechtswidrige Inhalte waren zum Zeitpunkt der Verlinkung nicht
            erkennbar.
          </p>
          <p>
            Eine permanente inhaltliche Kontrolle der verlinkten Seiten ist
            jedoch ohne konkrete Anhaltspunkte einer Rechtsverletzung nicht
            zumutbar. Bei Bekanntwerden von Rechtsverletzungen werden wir
            derartige Links umgehend entfernen.
          </p>
          <h2>Urheberrecht</h2>
          <p>
            Die durch die Seitenbetreiber erstellten Inhalte und Werke auf
            diesen Seiten unterliegen dem deutschen Urheberrecht. Die
            Vervielfältigung, Bearbeitung, Verbreitung und jede Art der
            Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der
            schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers.
            Downloads und Kopien dieser Seite sind nur für den privaten, nicht
            kommerziellen Gebrauch gestattet.
          </p>
          <p>
            Soweit die Inhalte auf dieser Seite nicht vom Betreiber erstellt
            wurden, werden die Urheberrechte Dritter beachtet. Insbesondere
            werden Inhalte Dritter als solche gekennzeichnet. Sollten Sie
            trotzdem auf eine Urheberrechtsverletzung aufmerksam werden, bitten
            wir um einen entsprechenden Hinweis. Bei Bekanntwerden von
            Rechtsverletzungen werden wir derartige Inhalte umgehend entfernen.
          </p>

          <p>
            Quelle:{" "}
            <a href="https://www.e-recht24.de">https://www.e-recht24.de</a>
          </p>
        </Section>
      </div>
    </div>
  )
}

export default Imprint
